/**
 * seedVisits.js
 * Inserts 20+ realistic store visit records into employee.store_visits collection
 * without touching any existing data.
 *
 * Usage: node scripts/seedVisits.js
 *
 * IDs from the main seed.js:
 *   Tenant  : 69c0fbbe60763acca36b8dbe  (ReatchAll)
 *   Employee: 69c0fbbe60763acca36b8dc4  (ReatchAll Employee)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const StoreVisit = require('../models/employee/StoreVisit');
const Dashboard = require('../models/employee/Dashboard');
const User = require('../models/tenant/User');

// ─── Constants ───────────────────────────────────────────────────────────────
const EMPLOYEE_ID = '69c0fbbe60763acca36b8dc4';
const TENANT_ID = '69c0fbbe60763acca36b8dbe';

// Stores the employee engages with
const STORES = [
  { name: 'ReatchAll Partner Store A', lat: 12.9352, lng: 77.6245 },
  { name: 'ReatchAll Partner Store B', lat: 12.9611, lng: 77.6387 },
  { name: 'Global Tech Solutions HQ', lat: 13.0287, lng: 77.5568 },
  { name: 'Sunrise Electronics Outlet', lat: 12.9168, lng: 77.5986 },
  { name: 'Metro Retail Hub', lat: 12.9783, lng: 77.6408 },
  { name: 'Alpha Distribution Depot', lat: 12.9450, lng: 77.7051 },
  { name: 'Nexus Wholesale Market', lat: 12.9981, lng: 77.5780 },
];

// ─── Date Helpers ─────────────────────────────────────────────────────────────
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 9) + 9, Math.floor(Math.random() * 60), 0, 0);
  return d;
};

// ─── Visit Catalogue ─────────────────────────────────────────────────────────
// Parameters per visit:
//  status   : completed | partially_completed | not_interested | follow_up
//  onTime   : true (on-time) | false (delayed)
//  consistent: true = submitted correct data | false = missing/partial data
//  storeIdx : index into STORES array
// ─────────────────────────────────────────────────────────────────────────────

const visitsTemplate = [
  // WEEK 1: High Performance
  { daysBack: 0, store: 0, status: 'completed', onTime: true,  consistent: true,  notes: '[Efficiency: 1.0] Masterful execution. All stock counted.' },
  { daysBack: 0, store: 1, status: 'completed', onTime: true,  consistent: true,  notes: '[Reliability: 1.0] Regular check-in with perfect punctuality.' },
  { daysBack: 1, store: 2, status: 'completed', onTime: true,  consistent: true,  notes: '[Accuracy: 1.0] Detailed audit submitted without errors.' },
  { daysBack: 1, store: 3, status: 'completed', onTime: true,  consistent: true,  notes: '[Speed: 1.0] Rapid response to store manager overflow.' },
  { daysBack: 2, store: 4, status: 'completed', onTime: true,  consistent: true,  notes: '[Engagement: Broad] New store onboarded successfully.' },
  
  // WEEK 2: Procedural Delays
  { daysBack: 3, store: 5, status: 'completed', onTime: false, consistent: true,  notes: '[Speed: 0.4] Delayed by logistics but work quality high.' },
  { daysBack: 4, store: 6, status: 'completed', onTime: false, consistent: true,  notes: '[Reliability: 0.4] Slight delay in arrival, tasks finished.' },
  { daysBack: 5, store: 0, status: 'partially_completed', onTime: true, consistent: false, notes: '[Accuracy: 0.0] Checklist partially skipped due to time.' },
  { daysBack: 6, store: 1, status: 'pending',   onTime: true,  consistent: true,  notes: '[Efficiency: 0.5] Mid-shift: Follow-up visit in progress.' },
  { daysBack: 7, store: 2, status: 'rejected',  onTime: false, consistent: false, notes: '[Overall: 0.0] Critical: Store closed, late arrival.' },

  // WEEK 3: Consistent Mid-tier
  { daysBack: 8, store: 3, status: 'completed', onTime: true,  consistent: true,  notes: '[Reliability: 1.0] Steady performance at Hub B.' },
  { daysBack: 9, store: 4, status: 'completed', onTime: true,  consistent: true,  notes: '[Efficiency: 1.0] Resource optimization successful.' },
  { daysBack: 10,store: 5, status: 'completed', onTime: true,  consistent: true,  notes: '[Engagement: 1.0] Strong relationship with owner established.' },
  { daysBack: 11,store: 6, status: 'partially_completed', onTime: true, consistent: true, notes: '[Efficiency: 0.6] Partial inventory audit completed.' },
  { daysBack: 12,store: 0, status: 'completed', onTime: false, consistent: true,  notes: '[Speed: 0.4] Late start due to morning briefing.' },

  // WEEK 4: Closing Strong
  { daysBack: 13,store: 1, status: 'completed', onTime: true,  consistent: true,  notes: '[Accuracy: 1.0] Perfect data submission for Q1 report.' },
  { daysBack: 14,store: 2, status: 'completed', onTime: true,  consistent: true,  notes: '[Reliability: 1.0] Consistent daily target of 5+ visits.' },
  { daysBack: 15,store: 3, status: 'completed', onTime: true,  consistent: true,  notes: '[Efficiency: 1.0] Optimized route enabled early completion.' },
  { daysBack: 16,store: 4, status: 'completed', onTime: true,  consistent: true,  notes: '[Engagement: 1.0] Reached 100% store coverage target.' },
  { daysBack: 17,store: 5, status: 'completed', onTime: true,  consistent: true,  notes: '[Final: Excellent] Strong monthly finish.' },
];

// ─── Capability Calculation ────────────────────────────────────────────────────
/**
 * Computes [Efficiency, Reliability, Speed, Accuracy, Engagement] scores (0-100)
 * based on visit data.
 */
function computeCapabilities(visits) {
  if (!visits || visits.length === 0) return [0, 0, 0, 0, 0];
  const total = visits.length;

  // 1. Efficiency: Weighted Status Sum / Total
  const statusWeights = { completed: 1, partially_completed: 0.6, pending: 0.5, follow_up: 0.3, not_interested: 0.2 };
  const weightedStatus = visits.reduce((acc, v) => acc + (statusWeights[v.status] || 0), 0);
  const efficiency = Math.round((weightedStatus / total) * 100);

  // 2. Reliability: % of onTime === true
  const reliability = Math.round((visits.filter(v => v.onTime).length / total) * 100);

  // 3. Speed: % of onTime === true
  const speed = Math.round((visits.filter(v => v.onTime).length / total) * 100);

  // 4. Accuracy: % of consistent === true
  const accuracy = Math.round((visits.filter(v => v.consistent).length / total) * 100);

  // 5. Engagement: unique stores visited / total possible (max 100)
  const uniqueStores = new Set(visits.map(v => v.storeIndex)).size;
  const engagement = Math.min(100, Math.round((uniqueStores / STORES.length) * 100));

  return [efficiency, reliability, speed, accuracy, engagement];
}

// ─── Seeder ───────────────────────────────────────────────────────────────────
const seedVisits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // ── Verify the employee and tenant exist ──────────────────────────────────
    const employeeDoc = await User.findById(EMPLOYEE_ID);
    if (!employeeDoc) {
      console.error(`Employee ${EMPLOYEE_ID} not found. Run main seed.js first.`);
      process.exit(1);
    }

    // ── Build visit documents ──────────────────────────────────────────────────
    const visitDocs = visitsTemplate.map((v) => {
      const store = STORES[v.store];
      const ts = daysAgo(v.daysBack);
      return {
        employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
        tenant: new mongoose.Types.ObjectId(TENANT_ID),
        storeName: store.name,
        status: v.status,
        onTime: v.onTime ? 'completed' : 'delay',
        isConsistent: v.consistent ? 'consistent' : 'inconsistent',
        gps: { lat: store.lat, lng: store.lng },
        notes: v.notes,
        photos: [],
        checklist: [],
        timestamp: ts,
        createdAt: ts,
        updatedAt: ts,
      };
    });

    // ── Insert WITHOUT wiping existing data ────────────────────────────────────
    const result = await StoreVisit.insertMany(visitDocs, { ordered: false });
    console.log(`\nInserted ${result.length} store visit records into employee.store_visits.`);

    // ── Compute capabilities from inserted visits ──────────────────────────────
    const caps = computeCapabilities(visitsTemplate.map((v, i) => ({
      status: v.status,
      onTime: v.onTime,
      consistent: v.consistent,
      storeIndex: v.store,
    })));

    console.log(`\nComputed Field Mastery Capabilities: ${caps.join(', ')}`);
    console.log('  Efficiency  :', caps[0]);
    console.log('  Reliability :', caps[1]);
    console.log('  Speed       :', caps[2]);
    console.log('  Accuracy    :', caps[3]);
    console.log('  Engagement  :', caps[4]);

    // ── Upsert into employee.dashboard collection ─────────────────────────────
    const dashResult = await Dashboard.findOneAndUpdate(
      { employee: new mongoose.Types.ObjectId(EMPLOYEE_ID) },
      {
        employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
        tenant: new mongoose.Types.ObjectId(TENANT_ID),
        capabilities: caps,
      },
      { upsert: true, new: true }
    );

    console.log(`\nStored capabilities in employee.dashboard (id: ${dashResult._id})`);
    console.log('\nDone! Existing data was NOT altered.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedVisits();
