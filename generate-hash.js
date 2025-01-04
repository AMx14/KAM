const bcrypt = require('bcrypt');

// Replace with your desired password
const password = 'admin_password';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        process.exit(1);
    }
    console.log('Generated hash:', hash);
    process.exit(0);
});
