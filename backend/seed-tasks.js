const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/employee/Task');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const EMPLOYEE_ID = '69c0fbbe60763acca36b8dc4';
const TENANT_ID = '69c0fbbe60763acca36b8dbe';

const tasks = [
  {
    employee: EMPLOYEE_ID,
    tenant: TENANT_ID,
    title: 'Store Inventory Audit',
    store: 'Big Bazaar Central',
    companyName: 'Future Group Retail',
    companyContact: 'Rajesh Kumar',
    companyEmail: 'ops@futuregroup.in',
    companyInsight: 'Premium Partner • 12 Months',
    companyDescription: 'Flagship hypermarket location with high daily footfall. Focus intensely on premium product placement.',
    address: 'MG Road, Bengaluru',
    distance: '1.2 km',
    distanceVal: 1.2,
    eta: '20 mins',
    priority: 'high',
    status: 'pending',
    visitStatus: 'Reached Client',
    missionStatus: 'Pending',
    isTaskStarted: false,
    dueDate: 'Today, 05:00 PM',
    type: 'Audit',
    incentive: '₹250',
    incentiveVal: 250,
    difficulty: 'Medium',
    coords: { x: 45, y: 30 },
    evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
    checklist: [
      { id: 1, text: 'Verify store check-in with GPS verification', completed: false },
      { id: 2, text: 'Upload 4 photos of main aisle displays', completed: false },
      { id: 3, text: 'Log stock count for Tier 1 SKUs', completed: false },
      { id: 4, text: 'Collect manager digital signature', completed: false }
    ]
  },
  {
    employee: EMPLOYEE_ID,
    tenant: TENANT_ID,
    title: 'Merchandise Display',
    store: 'Reliance Fresh',
    companyName: 'Reliance Retail Ltd',
    companyContact: 'Anjali Sharma',
    companyEmail: 'store.support@reliance.com',
    companyInsight: 'Top Tier Client • High Volume',
    companyDescription: 'Core retail partner for daily essentials. Ensure correct pricing tags and promotional banners.',
    address: 'Indiranagar, Bengaluru',
    distance: '3.4 km',
    distanceVal: 3.4,
    eta: '25 mins',
    priority: 'medium',
    status: 'in-progress',
    visitStatus: 'Discussing',
    missionStatus: 'In Progress',
    isTaskStarted: true,
    dueDate: 'Today, 07:00 PM',
    type: 'Retail',
    incentive: '₹150',
    incentiveVal: 150,
    difficulty: 'Hard',
    coords: { x: 70, y: 50 },
    evidence: { storeFront: 'mock-file.jpg', selfie: null, productDisplay: null, officialDoc: null },
    checklist: [
      { id: 1, text: 'Clean primary display shelf', completed: true },
      { id: 2, text: 'Arrange promotional banners', completed: false },
      { id: 3, text: 'Verify price tag accuracy', completed: false }
    ]
  }
];

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for task seeding...');
    
    await Task.deleteMany({ employee: EMPLOYEE_ID });
    console.log('Cleared existing dummy tasks for this employee.');
    
    await Task.insertMany(tasks);
    console.log('Inserted dummy tasks successfully.');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

seedTasks();
