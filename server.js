const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection'); // this require brings in the Sequelize ORM
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
// we use the sequelize.sync() method to establish the
// connection to the database. The "sync" part means that
// this is Sequelize taking the models and connecting 
// them to associated database tables. If it doesn't find a
// table, it'll create it for you!

// If we change the value of the force property to true,
// then the database connection must sync with the model
// definitions and associations. By forcing the sync method
// to true, we will make the tables re-create if there are
// any association changes. This definition performs similarly
// to DROP TABLE IF EXISTS, which was used previously.
// This allows the table to be overwritten and re-created.

// True or False? Do we need to drop the tables if we introduce
// changes to the model associations in Sequelize? Yes, we do
// this by making Sequelize create new tables if the data model
// or model associations have changed by using the command
// sequelize.sync({force:true}) in the server.js file.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});