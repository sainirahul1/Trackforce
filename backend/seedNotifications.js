/**
 * seedNotifications.js
 * 
 * Seeds mock notifications for all users in the database.
 * Includes rich, reatchAll-branded mock data.
 * Run with: node backend/seedNotifications.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/tenant/User');
const Notification = require('./models/tenant/Notification');

// ─── reatchAll Employee Notifications ───────────────────────────────────────
const employeeNotifications = [
  {
    title: '🗺️ New Route Assigned',
    desc: 'Your manager has assigned you to the reatchAll North Zone 04 route. Start by 9:00 AM.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '📍 Visit Reminder — D-Mart Whitefield',
    desc: 'Upcoming store visit at D-Mart Whitefield scheduled for 2:30 PM today. Don\'t forget to bring the branding kit.',
    type: 'reminder', priority: 'medium', isRead: false,
  },
  {
    title: '🤳 Selfie Check-In Required',
    desc: 'Please upload your arrival selfie to verify your presence at Heritage Fresh, Koramangala.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '✅ Order Confirmed — #ORD-1024',
    desc: 'Order #ORD-1024 for Reliance Smart Basavanagudi has been verified and dispatched. Great job!',
    type: 'success', priority: 'low', isRead: false,
  },
  {
    title: '✅ Visit Synced — More Megamart',
    desc: 'Your data for More Megamart HSR Layout has been synced successfully. Report available in Activity.',
    type: 'success', priority: 'low', isRead: true,
  },
  {
    title: '📋 New Task — Branding Material Pickup',
    desc: 'Collect reatchAll Q2 branding packages from the Central Depot before 12:00 PM.',
    type: 'task', priority: 'medium', isRead: false,
  },
  {
    title: '⚠️ Low Stock Alert — Premium Energy Drink',
    desc: '"reatchAll Premium Energy Drink 500ml" stock is below threshold at 3 outlets in your zone. Escalate to your manager.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '💰 Collection Processed — Fresh Mart',
    desc: 'Payment collection of ₹52,000 from Fresh Mart Indiranagar has been verified by accounts.',
    type: 'success', priority: 'medium', isRead: true,
  },
  {
    title: '🌙 End-of-Day Report Due',
    desc: 'Please submit your daily field report by 7:30 PM. Your manager is waiting for the Zone 04 summary.',
    type: 'reminder', priority: 'high', isRead: false,
  },
  {
    title: '📦 Delivery Confirmed',
    desc: 'Delivery batch #DEL-448 to Spar Hypermarket completed. 24 units successfully stocked.',
    type: 'success', priority: 'low', isRead: true,
  },
  {
    title: '🎯 Weekly Target: 80% Achieved',
    desc: 'You\'ve completed 80% of your weekly target! 4 more visits to unlock your performance bonus.',
    type: 'success', priority: 'medium', isRead: false,
  },
];

// ─── reatchAll Manager Notifications ─────────────────────────────────────────
const managerNotifications = [
  {
    title: '👤 Ravi Kumar Checked In',
    desc: 'Ravi Kumar has started his route in reatchAll South Zone 02 at 9:05 AM.',
    type: 'success', priority: 'low', isRead: false,
  },
  {
    title: '🔥 High Value Order — Star Bazaar',
    desc: 'Priya Sharma just closed a ₹1,85,000 bulk order at Star Bazaar Marathahalli. Mark for priority dispatch.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '❌ Missed Visit — Ananya Singh',
    desc: 'Ananya Singh missed her scheduled 11:00 AM appointment at Big Bazaar Hebbal. No check-in detected.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '🏆 Target 100% — Vikram Nair',
    desc: 'Vikram Nair has completed all 8 visits and hit 100% of his daily reatchAll target. Excellent!',
    type: 'success', priority: 'high', isRead: false,
  },
  {
    title: '🔓 Rahul Desai Checked Out',
    desc: 'Rahul Desai has completed his final visit at Spencer\'s Retail and signed off for the day.',
    type: 'success', priority: 'low', isRead: true,
  },
  {
    title: '🛑 Route Not Started — Kiran Mehta',
    desc: 'Kiran Mehta hasn\'t logged in to Central Zone 03 yet. Route start was due at 8:30 AM.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '📉 Low Performance — Central Zone',
    desc: 'reatchAll Central Zone efficiency is 18% below this week\'s target. Review required.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '📄 Report Uploaded — Megha Pillai',
    desc: 'Megha Pillai has submitted her end-of-day field report for East Zone. 6 outlets covered.',
    type: 'message', priority: 'low', isRead: true,
  },
  {
    title: '🏥 Leave Request — Rohit Joshi',
    desc: 'Rohit Joshi from West Zone has requested sick leave for 28 March. Immediate coverage needed.',
    type: 'message', priority: 'high', isRead: false,
  },
  {
    title: '📦 Inventory Reorder Needed',
    desc: 'reatchAll stock for "Berry Blast Juice 1L" is critically low across 5 West Zone outlets. Reorder urgently.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '📊 Zone Weekly Report Available',
    desc: 'South Zone 02 weekly performance report is ready. Avg. visit time: 22 min. Completion rate: 91%.',
    type: 'message', priority: 'medium', isRead: false,
  },
];

// ─── reatchAll Tenant Notifications ──────────────────────────────────────────
const tenantNotifications = [
  {
    title: '👤 New Employee Onboarded',
    desc: 'A new Field Executive has been registered under reatchAll. Account is now active.',
    type: 'account', priority: 'low', isRead: false,
  },
  {
    title: '🧑‍💼 New Manager Added — South Zone',
    desc: 'A new Manager account has been created for reatchAll South Zone operations.',
    type: 'account', priority: 'medium', isRead: false,
  },
  {
    title: '⏳ Subscription Expiring in 7 Days',
    desc: 'Your reatchAll TrackForce Pro subscription expires on 4 April 2026. Please renew to avoid disruption.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '📊 Q1 Operational Report Ready',
    desc: 'Your Q1 2026 reatchAll performance report is available. 1,248 visits, ₹84L+ orders processed.',
    type: 'message', priority: 'medium', isRead: false,
  },
  {
    title: '📍 North Zone Coverage Expanded',
    desc: 'reatchAll North Zone now covers 3 additional areas: Devanahalli, Yelahanka, and Hebbal Extension.',
    type: 'system', priority: 'low', isRead: true,
  },
  {
    title: '✅ Q1 Field Data Synced',
    desc: 'All March 2026 field visit data from reatchAll has been synced and verified. 0 discrepancies found.',
    type: 'success', priority: 'low', isRead: true,
  },
  {
    title: '🚀 Upgraded to Enterprise Plan',
    desc: 'reatchAll has been upgraded to TrackForce Enterprise. Real-time tracking now active for all 6 zones.',
    type: 'success', priority: 'high', isRead: true,
  },
  {
    title: '🔐 Unusual Login Detected',
    desc: 'A login from an unrecognized device was detected on your reatchAll tenant account. Verify if this was you.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '🗂️ Employee Audit Complete',
    desc: '12 inactive employee accounts were reviewed. 3 have been flagged for deactivation in your reatchAll org.',
    type: 'system', priority: 'medium', isRead: false,
  },
  {
    title: '📦 Bulk Order Milestone',
    desc: 'reatchAll crossed ₹1 Crore in processed orders this month! A new organizational record.',
    type: 'success', priority: 'high', isRead: false,
  },
];

// ─── SuperAdmin Notifications ─────────────────────────────────────────────────
const superadminNotifications = [
  {
    title: '🏢 New Tenant — reatchAll',
    desc: 'reatchAll has registered on the TrackForce platform. 6 zones, 40+ employees. Onboarding complete.',
    type: 'account', priority: 'high', isRead: false,
  },
  {
    title: '⚠️ Subscription Expired — Fresho Corp',
    desc: 'Fresho Corp\'s subscription expired on 25 March. Account is in grace period. Contact required.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '💹 Revenue Milestone — ₹15L this Month',
    desc: 'TrackForce platform revenue crossed ₹15,00,000 in March 2026. reatchAll contributed ₹2,80,000.',
    type: 'success', priority: 'medium', isRead: false,
  },
  {
    title: '🛡️ System Health Check Passed',
    desc: 'All systems operational. DB latency: 42ms. API uptime: 99.97% over the last 7 days.',
    type: 'system', priority: 'low', isRead: true,
  },
  {
    title: '📈 API Usage Spike Detected',
    desc: 'Endpoint `/api/tracking` saw 3x normal traffic at 10:15 AM. Auto-scaled. Monitoring active.',
    type: 'alert', priority: 'high', isRead: false,
  },
  {
    title: '🔒 Tenant Suspended — GreenLeaf Co.',
    desc: 'GreenLeaf Co. was suspended due to 3 consecutive payment failures. Data retained per policy.',
    type: 'alert', priority: 'high', isRead: true,
  },
  {
    title: '🚀 Notifications Feature Deployed',
    desc: 'Isolated, role-based notification system is now live across all portals: Employee, Manager, Tenant, SuperAdmin.',
    type: 'system', priority: 'low', isRead: false,
  },
  {
    title: '💾 Weekly Backup Complete',
    desc: 'Scheduled database backup for 28 March completed. Size: 1.2 GB. Stored in secure cloud vault.',
    type: 'success', priority: 'low', isRead: true,
  },
  {
    title: '👥 10+ New Users This Week',
    desc: '12 new users (across 4 tenants including reatchAll) joined the platform this week.',
    type: 'account', priority: 'medium', isRead: false,
  },
  {
    title: '🔍 Audit Log Alert',
    desc: 'Unusual bulk-delete action detected on a tenant account. Logged in AuditLog. Manual review recommended.',
    type: 'alert', priority: 'high', isRead: false,
  },
];

// ─── Seeder Logic ─────────────────────────────────────────────────────────────
const getTemplateByRole = (role) => {
  switch (role) {
    case 'employee': return employeeNotifications;
    case 'manager': return managerNotifications;
    case 'tenant': return tenantNotifications;
    case 'superadmin': return superadminNotifications;
    default: return [];
  }
};

const seedNotifications = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');

  // Clear existing notifications
  await Notification.deleteMany({});
  console.log('🗑️  Cleared existing notifications');

  // Fetch all users (include company name for logging)
  const users = await User.find({}, '_id role company name');
  console.log(`👥 Found ${users.length} users\n`);

  let totalCreated = 0;

  for (const user of users) {
    const template = getTemplateByRole(user.role);
    if (!template.length) continue;

    const notifications = template.map((n, i) => ({
      ...n,
      recipient: user._id,
      createdAt: new Date(Date.now() - i * 25 * 60 * 1000), // Stagger by 25 mins
    }));

    await Notification.insertMany(notifications);
    totalCreated += notifications.length;
    console.log(`  ✓ [${user.company || 'Unknown'}] ${user.role} "${user.name}" → ${notifications.length} notifications`);
  }

  console.log(`\n🎉 Done! Created ${totalCreated} notifications across ${users.length} users.`);
  mongoose.disconnect();
};

seedNotifications().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
