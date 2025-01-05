const http = require('http');

const options = {
    host: 'localhost',
    port: process.env.PORT || 3000,
    timeout: 2000,
    path: '/health' // Add this endpoint to your Express app
};

const request = http.request(options, (res) => {
    process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', function(err) {
    process.exit(1);
});

request.end(); 