export const mockCompanies = [
  { id: 1, name: 'Global Tech', industry: 'IT', employees: 120, status: 'Active', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100' },
  { id: 2, name: 'Eco Logistics', industry: 'Shipping', employees: 85, status: 'Active', logo: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=100' },
];

export const mockEmployees = [
  { id: 101, name: 'Uma maheshwari', designation: 'Operations Manager', status: 'On Duty', team: 'Aaaa', visitsToday: 5, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 102, name: 'Ramya', designation: 'Regional Manager', status: 'Off Duty', team: 'Bbbb', visitsToday: 3, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 103, name: 'Naresh', designation: 'Team Lead', status: 'On Duty', team: 'Cccc', visitsToday: 7, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 104, name: 'Abhiram', designation: 'Project Manager', status: 'On Leave', team: 'Dddd', visitsToday: 0, avatar: 'https://i.pravatar.cc/150?u=15' },
  { id: 105, name: 'rahul', designation: 'Operations Manager', status: 'On Duty', team: 'Eeee', visitsToday: 4, avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 106, name: 'srinivas', designation: 'District Manager', status: 'On Duty', team: 'Ffff', visitsToday: 2, avatar: 'https://i.pravatar.cc/150?u=26' },
  { id: 107, name: 'chandhu', designation: 'Team Lead', status: 'Off Duty', team: 'Gggg', visitsToday: 6, avatar: 'https://i.pravatar.cc/150?u=72' },
  { id: 108, name: 'prashanth', designation: 'Regional Manager', status: 'On Duty', team: 'Hhhh', visitsToday: 5, avatar: 'https://i.pravatar.cc/150?u=82' },
];

export const mockIssues = [
  { id: 1, from: 'rahul', fromRole: 'employee', to: 'manager', subject: 'Device Malfunction', status: 'Open', priority: 'High', date: '2024-03-12' },
  { id: 2, from: 'Abhiram', fromRole: 'manager', to: 'tenant', subject: 'Payroll Discrepancy', status: 'Resolved', priority: 'Medium', date: '2024-03-11' },
  { id: 3, from: 'Global Tech', fromRole: 'tenant', to: 'superadmin', subject: 'Server Latency', status: 'In Progress', priority: 'Critical', date: '2024-03-13' },
  { id: 4, from: 'Uma maheshwari', fromRole: 'employee', to: 'manager', subject: 'Route Access Denied', status: 'Open', priority: 'High', date: '2024-03-13' },
];
