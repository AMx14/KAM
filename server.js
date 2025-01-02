require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/api'); // Import the API routes
const db = require('./src/infra/db'); // Sequelize setup

const app = express();
app.use(bodyParser.json());
app.use('/api', routes); // Mount API routes

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
