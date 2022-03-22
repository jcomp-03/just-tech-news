// impor the Sequelize constructor from the library
const Sequelize = require('sequelize');

// pull in the MySQL database name, username, and password saved in .env file
require('dotenv').config();

// create a connectino to our database, pass in MySQL information
// from .env file
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;