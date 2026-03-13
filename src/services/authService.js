const credentials = {
  superadmin: { email: 'superadmin@trackforce.com', password: 'admin123', role: 'superadmin', name: 'Platform Admin' },
  tenant: { email: 'tenant@company.com', password: 'tenant123', role: 'tenant', name: 'Company Admin' },
  manager: { email: 'manager@company.com', password: 'manager123', role: 'manager', name: 'Team Manager' },
  employee: { email: 'employee@company.com', password: 'employee123', role: 'employee', name: 'Field Executive' },
};

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userKey = Object.keys(credentials).find(k => credentials[k].email === email && credentials[k].password === password);
      if (userKey) {
        const user = { ...credentials[userKey] };
        delete user.password;
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      } else reject(new Error('Invalid credentials'));
    }, 500);
  });
};
