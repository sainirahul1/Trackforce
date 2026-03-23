const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/employee/Task');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const TARGET_USER_ID = '69bd05f66a0c7053c7baa200';
const MOCK_TENANT_ID = '69bd05f66a0c7053c7baa000';

const today = new Date();
const yesterday = new Date(new Date().setDate(today.getDate() - 1));
const thisWeek = new Date(new Date().setDate(today.getDate() + 2));
const thisMonth = new Date(new Date().setDate(today.getDate() + 15));

const tasks = [
  {
    employee: TARGET_USER_ID,
    tenant: MOCK_TENANT_ID,
    title: 'Today Task 1',
    store: 'Phoenix Marketcity',
    companyName: 'Retail Corp',
    priority: 'high',
    status: 'pending',
    date: today,
    dueDate: 'Today, 06:00 PM',
    type: 'Audit',
    coords: { x: 30, y: 40 },
    checklist: [{ id: 1, text: 'Check display', completed: false }]
  },
  {
    employee: TARGET_USER_ID,
    tenant: MOCK_TENANT_ID,
    title: 'Yesterday Task 1',
    store: 'Mantri Mall',
    companyName: 'Fashion Hub',
    priority: 'medium',
    status: 'completed',
    date: yesterday,
    dueDate: 'Yesterday, 08:00 PM',
    type: 'Retail',
    coords: { x: 60, y: 50 },
    checklist: [{ id: 1, text: 'Clean area', completed: true }]
  },
  {
    employee: TARGET_USER_ID,
    tenant: MOCK_TENANT_ID,
    title: 'This Week Task 1',
    store: 'Spar Hypermarket',
    companyName: 'Future Group',
    priority: 'low',
    status: 'pending',
    date: thisWeek,
    dueDate: 'Wait for Schedule',
    type: 'Finance',
    coords: { x: 20, y: 70 },
    checklist: [{ id: 1, text: 'Collect bills', completed: false }]
  },
  {
    employee: TARGET_USER_ID,
    tenant: MOCK_TENANT_ID,
    title: 'This Month Task 1',
    store: 'Reliance Digital',
    companyName: 'Reliance Retail',
    priority: 'medium',
    status: 'pending',
    date: thisMonth,
    dueDate: 'End of Month',
    type: 'Audit',
    coords: { x: 80, y: 20 },
    checklist: [{ id: 1, text: 'Verify stock', completed: false }]
  }
];

const seedTimeframes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    await Task.deleteMany({ tenant: MOCK_TENANT_ID });
    console.log('Cleared existing tasks for mock tenant.');
    
    await Task.insertMany(tasks);
    console.log('Inserted multi-timeframe tasks successfully.');
    
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedTimeframes();
