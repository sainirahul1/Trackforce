const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/superadmin/settings',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'PUT',
    'Access-Control-Request-Headers': 'authorization,content-type'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
req.end();
