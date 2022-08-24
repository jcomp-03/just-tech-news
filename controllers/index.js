// Much like the API folder's index.js file that collects the
// endpoints and prefixes them, here we are collecting the 
// packaged group of API endpoints and prefixing them with the 
// path /api.

const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
router.use('/', homeRoutes);

const apiRoutes = require('./api');
router.use('/api', apiRoutes);

const dashboardRoutes = require('./dashboard-routes.js');
router.use('/dashboard', dashboardRoutes);

// This is so if we make a request to any endpoint that doesn't exist, 
// we'll receive a 404 error indicating we have requested an incorrect
// resource, another RESTful API practice.
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;