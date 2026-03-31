const { Server } = require('socket.io');
const TrackingSession = require('./models/employee/TrackingSession');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room.`);
    });

    socket.on('tracking:update', async (data) => {
      // data: { employeeId, employeeName, managerId, tenantId, location: { lat, lng }, timestamp }
      console.log(`[SOCKET] Tracking update: ${data.employeeName} (${data.employeeId}) -> Tenant: ${data.tenantId}, Manager: ${data.managerId}`);

      const { employeeId, location, tenantId, managerId } = data;
      if (!employeeId || !location || isNaN(location.lat) || isNaN(location.lng)) {
        console.warn(`[SOCKET] Invalid tracking data from ${data.employeeName || 'Unknown'}`);
        return;
      }

      // 1. Resolve Address via Geocoding (with fallback)
      let resolvedAddress = `Lat: ${Number(location.lat).toFixed(6)}, Lng: ${Number(location.lng).toFixed(6)}`;
      let resolvedCity = '';

      try {
        const fetch = require('node-fetch');
        const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
        if (apiKey && location.lat && location.lng) {
          const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`);
          const geoData = await geoResponse.json();
          if (geoData.status === 'OK' && geoData.results?.[0]) {
            resolvedAddress = geoData.results[0].formatted_address;
            const locality = geoData.results[0].address_components.find(c => c.types.includes('locality'));
            if (locality) resolvedCity = locality.long_name;
          } else {
            console.warn(`[GEOCODE] status: ${geoData.status}. Using coordinates fallback.`);
          }
        }
      } catch (geoErr) {
        console.error('[GEOCODE] Error:', geoErr);
      }

      // 2. Broadcast to rooms (Manager & Tenant)
      const liveData = {
        ...data,
        address: resolvedAddress,
        city: resolvedCity,
        location: { lat: Number(location.lat), lng: Number(location.lng) }
      };

      const tenantRoom = tenantId?.toString();
      const managerRoom = managerId?.toString();

      if (tenantRoom) io.to(tenantRoom).emit('tracking:live', liveData);
      if (managerRoom && managerRoom !== tenantRoom) io.to(managerRoom).emit('tracking:live', liveData);

      // 3. Persist to Database and Calculate Distance
      try {
        const mongoose = require('mongoose');
        const userId = new mongoose.Types.ObjectId(employeeId);
        const lat = Number(location.lat);
        const lng = Number(location.lng);

        // Find the latest active session for this user
        let session = await TrackingSession.findOne({ user: userId, status: 'active' }).sort({ startTime: -1 });

        // Fallback: If no active session found but GPS is arriving, something is out of sync
        if (!session) {
          console.warn(`[DATABASE] Session Mismatch for ${data.employeeName} (${employeeId}). Searching for most recent session regardless of status...`);
          session = await TrackingSession.findOne({ user: userId }).sort({ createdAt: -1 });

          if (session && session.status !== 'active') {
            console.log(`[DATABASE] Found recent ${session.status} session. Re-activating it to capture incoming GPS data.`);
            session.status = 'active';
            await session.save();
          }
        }

        let currentDistance = 0;
        let totalPoints = 0;

        if (session) {
          let distanceIncrement = 0;
          if (session.route && session.route.length > 0) {
            const lastPoint = session.route[session.route.length - 1];
            // Haversine formula
            const R = 6371; // km
            const dLat = (lat - lastPoint.lat) * Math.PI / 180;
            const dLng = (lng - lastPoint.lng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lastPoint.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distanceIncrement = R * c;
          }

          const updatedSession = await TrackingSession.findByIdAndUpdate(
            session._id,
            {
              $push: {
                route: {
                  lat: lat,
                  lng: lng,
                  timestamp: new Date(data.timestamp || Date.now())
                }
              },
              $set: {
                employeeName: data.employeeName,
                manager: managerId,
                currentAddress: resolvedAddress,
                currentCity: resolvedCity,
                updatedAt: new Date()
              },
              $inc: {
                distanceTravelled: isNaN(distanceIncrement) ? 0 : distanceIncrement
              }
            },
            { new: true }
          );

          currentDistance = updatedSession.distanceTravelled;
          totalPoints = updatedSession.route.length;
          // Emitting back distance update if needed
          if (tenantRoom) io.to(tenantRoom).emit('tracking:live', { ...liveData, distanceTravelled: currentDistance });

          console.log(`[DATABASE] SUCCESS: Point saved for ${data.employeeName}. Pts: ${updatedSession.route.length}, Session: ${updatedSession._id}`);
        } else {
          console.error(`[DATABASE] FATAL: No session could be found/created for ${data.employeeName} (${employeeId})`);
        }
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
