const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/employee/Task');
const User = require('./models/tenant/User');
const Tenant = require('./models/superadmin/Tenant');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const TARGET_USER_ID = '69bd05f66a0c7053c7baa200';
const MOCK_TENANT_ID = '69bd05f66a0c7053c7baa000';

const tasks = [
  {
    employee: TARGET_USER_ID,
    tenant: MOCK_TENANT_ID,
    title: 'Flagship Store Audit',
    store: 'Phoenix Marketcity',
    companyName: 'Retail Corp',
    companyContact: 'Deepak Menon',
    companyEmail: 'deepak@retailcorp.com',
    companyInsight: 'Enterprise Account • 3 Years',
    companyDescription: 'Primary electronics partner. Focus on Croma and Reliance Digital display compliance.',
    address: 'Whitefield, Bengaluru',
    distance: '3.5 km',
    distanceVal: 3.5,
    eta: '25 mins',
    priority: 'high',
    status: 'pending',
    visitStatus: 'Reached Client',
    missionStatus: 'Pending',
    isTaskStarted: false,
    dueDate: 'Today, 06:00 PM',
    type: 'Audit',
    incentive: '₹500',
    incentiveVal: 500,
    difficulty: 'Medium',
    coords: { x: 30, y: 40 },
    evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
    checklist: [
      { id: 1, text: 'Check main display units', completed: false },
      { id: 2, text: 'Verify staff attendance', completed: false }
    ]
  },
  {
    employee: TARGET_USER_ID,
    tenant: MOCK_TENANT_ID,
    title: 'Merchandise Refresh',
    store: 'Mantri Mall',
    companyName: 'Fashion Hub',
    companyContact: 'Sarah Jones',
    companyEmail: 'sarah@fashionhub.com',
    companyInsight: 'Premium Partner • 12 Months',
    companyDescription: 'High-end apparel store. Ensure the new summer collection is prominently displayed.',
    address: 'Malleshwaram, Bengaluru',
    distance: '1.2 km',
    distanceVal: 1.2,
    eta: '10 mins',
    priority: 'medium',
    status: 'in-progress',
    visitStatus: 'Discussing',
    missionStatus: 'In Progress',
    isTaskStarted: true,
    dueDate: 'Today, 08:00 PM',
    type: 'Retail',
    incentive: '₹300',
    incentiveVal: 300,
    difficulty: 'Easy',
    coords: { x: 60, y: 50 },
    evidence: { storeFront: 'display.jpg', selfie: null, productDisplay: null, officialDoc: null },
    checklist: [
      { id: 1, text: 'Clean display area', completed: true },
      { id: 2, text: 'Update price tags', completed: false }
    ]
  }
];

const seedForCurrentUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // 1. Ensure Tenant exists
    let tenant = await Tenant.findById(MOCK_TENANT_ID);
    if (!tenant) {
      tenant = await Tenant.create({
        _id: MOCK_TENANT_ID,
        name: 'Mock Deployment Org',
        industry: 'Retail',
        subscription: { plan: 'enterprise', status: 'active', employeeLimit: 1000 }
      });
    }

    // 2. Ensure User exists
    let user = await User.findById(TARGET_USER_ID);
    if (!user) {
      user = await User.create({
        _id: TARGET_USER_ID,
        name: 'Active Field Agent',
        email: 'active@trackforce.com',
        password: 'password123',
        role: 'employee',
        tenant: MOCK_TENANT_ID,
        company: 'Mock Corp'
      });
    }

    // 3. Insert Tasks
    await Task.deleteMany({ employee: TARGET_USER_ID });
    await Task.insertMany(tasks);
    console.log('Inserted updated dummy tasks for user:', TARGET_USER_ID);

    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedForCurrentUser();
