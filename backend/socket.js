const { Server } = require('socket.io');
const TrackingSession = require('./models/employee/TrackingSession');
const { reverseGeocode } = require('./utils/geocoder');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Standard Room Joining Logic for Isolated Real-time Sync
    socket.on('join_user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`[SOCKET] User ${userId} joined room: user:${userId}`);
    });

    socket.on('join_tenant', (tenantId) => {
      socket.join(`tenant:${tenantId}`);
      console.log(`[SOCKET] Tenant room joined: tenant:${tenantId}`);
    });

    socket.on('join_tenant_role', ({ tenantId, role }) => {
      const room = `tenant:${tenantId}:role:${role}`;
      socket.join(room);
      console.log(`[SOCKET] Role room joined: ${room}`);
    });

    socket.on('join_role', (role) => {
      socket.join(`role:${role}`);
      console.log(`[SOCKET] Global role room joined: role:${role}`);
    });

    // Legacy support for basic join
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      socket.join(userId);
      console.log(`[SOCKET] User ${userId} joined (legacy)`);
    });

    socket.on('tracking:update', async (data) => {
      // data: { employeeId, employeeName, managerId, tenantId, location: { lat, lng },
      //         timestamp, role, accuracy, battery, speed, heading, deviceId }
      const { employeeId, location, tenantId, managerId, role } = data;

      // 1. HARD VALIDATION: Role & Basic Data
      if (!employeeId || !location || isNaN(location.lat) || isNaN(location.lng)) {
        return;
      }
      if (!['employee', 'manager', 'tenant'].includes(role)) {
        console.warn(`[SOCKET] Unauthorized tracking role attempted: ${role}`);
        return;
      }

      try {
        const mongoose = require('mongoose');
        const userId = new mongoose.Types.ObjectId(employeeId);

        // 2. SESSION VALIDATION: Only proceed if they have an ACTIVE session
        let session = await TrackingSession.findOne({ user: userId, status: 'active' }).sort({ startTime: -1 });
        
        // AUTO-HEAL: If no active session, try to create one implicitly (Implicit Session Recovery)
        if (!session) {
          console.log(`[SOCKET] Implicitly creating session for ${data.employeeName} (Auto-Resume triggered)`);
          
          const User = require('./models/tenant/User');
          const userDoc = await User.findById(userId);
          
          if (!userDoc || !['employee', 'manager', 'tenant'].includes(userDoc.role)) {
            console.warn(`[SOCKET] Ignoring point for ${data.employeeName}: Invalid user/role for implicit tracking.`);
            return;
          }

          // Fetch manager name if possible
          let managerName = '';
          if (userDoc.manager) {
            const managerDoc = await User.findById(userDoc.manager);
            if (managerDoc) managerName = managerDoc.name;
          }

          session = await TrackingSession.create({
            user: userId,
            employeeName: userDoc.name,
            manager: userDoc.manager,
            managerName: managerName,
            tenant: tenantId || userDoc.tenant,
            startTime: new Date(),
            status: 'active'
          });

          // Mark user as tracking in DB
          if (!userDoc.isTracking) {
             userDoc.isTracking = true;
             await userDoc.save();
          }
        }

        const lat = Number(location.lat);
        const lng = Number(location.lng);
        const now = new Date(data.timestamp || Date.now());

        // 3. Extract device telemetry (graceful defaults)
        const accuracy = !isNaN(data.accuracy) ? Number(data.accuracy) : -1;
        const battery = !isNaN(data.battery) ? Number(data.battery) : -1;
        const deviceSpeed = !isNaN(data.speed) ? Number(data.speed) : -1;  // m/s from device
        const heading = !isNaN(data.heading) ? Number(data.heading) : -1;
        const deviceId = data.deviceId || 'unknown';

        // 4. Calculate Distance from last point (Haversine)
        let distanceIncrement = 0;
        let computedSpeedKmh = 0;
        const lastPoint = session.route && session.route.length > 0 ? session.route[session.route.length - 1] : null;

        if (lastPoint) {
          const R = 6371; // km
          const dLat = (lat - lastPoint.lat) * Math.PI / 180;
          const dLng = (lng - lastPoint.lng) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lastPoint.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          distanceIncrement = R * c;

          // Compute speed from distance/time if device speed unavailable
          const timeDiffSeconds = lastPoint.timestamp ? (now - new Date(lastPoint.timestamp)) / 1000 : 0;
          if (timeDiffSeconds > 0) {
            computedSpeedKmh = (distanceIncrement / timeDiffSeconds) * 3600; // km/h
          }
        }

        // Use device speed if available, otherwise computed speed
        const effectiveSpeedKmh = deviceSpeed >= 0 ? (deviceSpeed * 3.6) : computedSpeedKmh;

        // 5. ACTIVITY CLASSIFICATION
        const IDLE_SPEED_THRESHOLD = 0.5;  // km/h
        const currentSummary = session.activitySummary || {};
        const prevState = currentSummary.activityState || 'idle';
        const lastStateChange = currentSummary.lastStateChange ? new Date(currentSummary.lastStateChange) : session.startTime;
        const timeSinceLastStateChange = (now - lastStateChange) / 1000; // seconds

        let newState = prevState;
        if (effectiveSpeedKmh >= IDLE_SPEED_THRESHOLD) {
          newState = 'moving';
        } else {
          // Idle for > 3 minutes near a location = visiting, otherwise idle
          if (timeSinceLastStateChange > 180 && prevState === 'idle') {
            newState = 'visiting';
          } else if (prevState === 'moving') {
            newState = 'idle'; // just stopped
          }
          // If already visiting and still not moving, stay visiting
        }

        // Accumulate time for the PREVIOUS state before transitioning
        let movingInc = 0, idleInc = 0, visitInc = 0, travelInc = 0;
        const timeSinceLastPoint = lastPoint?.timestamp ? (now - new Date(lastPoint.timestamp)) / 1000 : 0;
        // Cap at 120s to avoid inflating from disconnected periods
        const cappedTime = Math.min(timeSinceLastPoint, 120);

        if (prevState === 'moving') {
          movingInc = cappedTime;
          travelInc = cappedTime;
        } else if (prevState === 'visiting') {
          visitInc = cappedTime;
        } else {
          idleInc = cappedTime;
        }

        // Running average speed
        const prevAvgSpeed = currentSummary.avgSpeed || 0;
        const prevMovingTime = currentSummary.totalMovingTime || 0;
        const newMovingTime = prevMovingTime + movingInc;
        const newAvgSpeed = newMovingTime > 0
          ? ((prevAvgSpeed * prevMovingTime) + (effectiveSpeedKmh * movingInc)) / newMovingTime
          : 0;
        const newMaxSpeed = Math.max(currentSummary.maxSpeed || 0, effectiveSpeedKmh);

        const activityUpdate = {
          totalMovingTime: (currentSummary.totalMovingTime || 0) + movingInc,
          totalIdleTime: (currentSummary.totalIdleTime || 0) + idleInc,
          totalVisitTime: (currentSummary.totalVisitTime || 0) + visitInc,
          totalTravelTime: (currentSummary.totalTravelTime || 0) + travelInc,
          avgSpeed: Math.round(newAvgSpeed * 10) / 10,
          maxSpeed: Math.round(newMaxSpeed * 10) / 10,
          lastBattery: battery,
          lastAccuracy: accuracy,
          activityState: newState,
          lastStateChange: newState !== prevState ? now : lastStateChange,
        };

        // 6. Resolve Address
        const initialAddress = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

        // 7. Broadcast IMMEDIATELY to managers with enriched telemetry
        const liveData = {
          ...data,
          address: data.address || session.currentAddress || initialAddress,
          lat, lng,
          location: { lat, lng },
          speed: Math.round(effectiveSpeedKmh * 10) / 10,
          accuracy,
          battery,
          heading,
          deviceId,
          activityState: newState,
          activitySummary: activityUpdate,
          distanceTravelled: (session.distanceTravelled || 0) + (isNaN(distanceIncrement) ? 0 : distanceIncrement),
        };

        const tenantRoom = tenantId ? `tenant:${tenantId.toString()}` : null;
        const managerRoom = managerId?.toString();
        const managerRoleRoom = tenantId ? `tenant:${tenantId.toString()}:role:manager` : null;

        if (tenantRoom) io.to(tenantRoom).emit('tracking:live', liveData);
        if (managerRoom && managerRoom !== tenantRoom) io.to(managerRoom).emit('tracking:live', liveData);
        if (managerRoleRoom) io.to(managerRoleRoom).emit('tracking:live', liveData);

        console.log(`[SOCKET] Telemetry: ${data.employeeName} | State: ${newState} | Speed: ${effectiveSpeedKmh.toFixed(1)} km/h | Battery: ${battery}% | Accuracy: ${accuracy}m`);

        // 8. Background geocoding (only if moved > 20m)
        let resolvedAddress = session.currentAddress || initialAddress;
        let resolvedCity = session.currentCity || '';

        try {
          const isRawCoordinate = session.currentAddress && session.currentAddress.startsWith('Lat:');
          const needsGeocode = !session.currentAddress || isRawCoordinate || (distanceIncrement > 0.02);

          if (needsGeocode) {
            const geoResult = await reverseGeocode(location.lat, location.lng);
            resolvedAddress = geoResult.address;
            resolvedCity = geoResult.city;

            const enrichedData = { ...liveData, address: resolvedAddress, city: resolvedCity };
            if (tenantRoom) io.to(tenantRoom).emit('tracking:live', enrichedData);
            if (managerRoom && managerRoom !== tenantRoom) io.to(managerRoom).emit('tracking:live', enrichedData);
          }
        } catch (geoErr) {
          console.error('[GEOCODE] Error in socket loop:', geoErr);
        }

        // 9. Persist to database
        const updatedSession = await TrackingSession.findByIdAndUpdate(
          session._id,
          {
            $push: {
              route: {
                lat, lng,
                timestamp: now,
                accuracy, battery,
                speed: deviceSpeed,
                heading, deviceId,
              }
            },
            $set: {
              employeeName: data.employeeName,
              manager: managerId,
              currentAddress: resolvedAddress,
              currentCity: resolvedCity,
              activitySummary: activityUpdate,
              updatedAt: now,
            },
            $inc: {
              distanceTravelled: isNaN(distanceIncrement) ? 0 : distanceIncrement
            }
          },
          { returnDocument: 'after' }
        );

        // Final enriched broadcast with persisted distance and resolved address
        const finalData = { ...liveData, address: resolvedAddress, city: resolvedCity, distanceTravelled: updatedSession.distanceTravelled };
        if (tenantRoom) io.to(tenantRoom).emit('tracking:live', finalData);
        if (managerRoom && managerRoom !== tenantRoom) io.to(managerRoom).emit('tracking:live', finalData);
        if (managerRoleRoom) io.to(managerRoleRoom).emit('tracking:live', finalData);
        console.log(`[DATABASE] Point saved for ${data.employeeName}. Address: ${resolvedAddress} | Distance: ${updatedSession.distanceTravelled.toFixed(2)} km | Activity: ${newState}`);

      } catch (err) {
        console.error('[DATABASE] Persistence Error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
