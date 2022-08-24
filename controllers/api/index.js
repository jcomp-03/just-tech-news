// This file, like index.js in the models folder, will serve as a means to collect all
// of the API routes and package them up for us.

// Remember how in user-routes.js we didn't use the word 'users' in
// any routes? That's because in that file we take those routes and
// implement them to another router instance (in this file index.js), 
// prefixing them with the path /users at that time (in this file on line 15).

const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes.js');
const commentRoutes = require('./comment-routes');


router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;