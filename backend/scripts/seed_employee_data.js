const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Task = require('../models/employee/Task');
const StoreVisit = require('../models/employee/StoreVisit');

dotenv.config({ path: path.join(__dirname, '../.env') });

const REACHALL_TENANT_ID = '69c0fbbe60763acca36b8dbe';

const employees = [
  { id: '69c0fbbe60763acca36b8dc4', name: 'Employee 1' },
  { id: '69c21351c49853b704a59102', name: 'Employee 2' },
  { id: '69c21351c49853b704a59105', name: 'Employee 3' },
  { id: '69c21351c49853b704a59108', name: 'Employee 4' }
];

const stores = [
  'ReatchAll Central',
  'ReatchAll Retail Hub',
  'ReatchAll Warehouse',
  'ReatchAll HQ',
  'Partner Store A',
  'Partner Store B',
  'Distribution Center Alpha',
  'Logistics Annex'
];

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data for these employees to ensure fresh isolation
    const employeeIds = employees.map(e => e.id);
    await Task.deleteMany({ employee: { $in: employeeIds } });
    await StoreVisit.deleteMany({ employee: { $in: employeeIds } });
    console.log('Cleared existing tasks and visits for ReatchAll employees.');

    for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        console.log(`Seeding data for ${emp.name}...`);

        // Create 3 tasks for each employee
        const empTasks = [
            {
                employee: emp.id,
                tenant: REACHALL_TENANT_ID,
                title: `${emp.name} - Daily Audit`,
                store: stores[i % stores.length],
                companyName: 'ReatchAll',
                priority: 'high',
                status: 'pending',
                date: new Date(),
                dueDate: 'Today, 06:00 PM',
                distance: `${(Math.random() * 5).toFixed(1)} km`,
                distanceVal: Math.random() * 5,
                eta: `${Math.floor(Math.random() * 30 + 5)} mins`,
                type: 'Audit',
                coords: { x: Math.random() * 100, y: Math.random() * 100 },
                checklist: [{ text: 'Inventory check', completed: false }]
            },
            {
                employee: emp.id,
                tenant: REACHALL_TENANT_ID,
                title: `${emp.name} - Stock Refresh`,
                store: stores[(i + 1) % stores.length],
                companyName: 'ReatchAll',
                priority: 'medium',
                status: 'pending',
                date: new Date(new Date().setDate(new Date().getDate() + 1)),
                dueDate: 'Tomorrow',
                distance: `${(Math.random() * 10).toFixed(1)} km`,
                distanceVal: Math.random() * 10,
                eta: `${Math.floor(Math.random() * 50 + 10)} mins`,
                type: 'Retail',
                coords: { x: Math.random() * 100, y: Math.random() * 100 },
                checklist: [{ text: 'Reorder items', completed: false }]
            },
            {
                employee: emp.id,
                tenant: REACHALL_TENANT_ID,
                title: `${emp.name} - Site Maintenance`,
                store: stores[(i + 2) % stores.length],
                companyName: 'ReatchAll',
                priority: 'low',
                status: 'completed',
                date: new Date(new Date().setDate(new Date().getDate() - 1)),
                dueDate: 'Yesterday',
                distance: `${(Math.random() * 3).toFixed(1)} km`,
                distanceVal: Math.random() * 3,
                eta: `${Math.floor(Math.random() * 20 + 5)} mins`,
                type: 'Maintenance',
                coords: { x: Math.random() * 100, y: Math.random() * 100 },
                checklist: [{ text: 'Check equipment', completed: true }]
            }
        ];
        await Task.insertMany(empTasks);

        // Create 2 store visits for each employee
        const empVisits = [
            {
                employee: emp.id,
                tenant: REACHALL_TENANT_ID,
                storeName: stores[(i + 3) % stores.length],
                status: 'completed',
                gps: { lat: 12.9716 + (Math.random() - 0.5) * 0.1, lng: 77.5946 + (Math.random() - 0.5) * 0.1 },
                notes: `Completed routine visit for ${emp.name}`,
                timestamp: new Date()
            },
            {
                employee: emp.id,
                tenant: REACHALL_TENANT_ID,
                storeName: stores[(i + 4) % stores.length],
                status: 'follow_up',
                gps: { lat: 12.9716 + (Math.random() - 0.5) * 0.1, lng: 77.5946 + (Math.random() - 0.5) * 0.1 },
                notes: `Currently performing audit at ${stores[(i + 4) % stores.length]}`,
                timestamp: new Date()
            }
        ];
        await StoreVisit.insertMany(empVisits);
    }

    console.log('Successfully seeded isolated tasks and visits for 4 employees.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

main();
