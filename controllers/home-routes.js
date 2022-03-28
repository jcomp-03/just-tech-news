// This file will contain all of the user-facing routes, such as the homepage and login page
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Previously, we used res.send() or res.sendFile() for the
// response. Because we've hooked up a template engine, we 
// can now use res.render() and specify which template we 
// want to use. The res.render() method can accept a second
// argument, an object, which includes all of the data you
// want to pass to your template.
router.get('/', (req, res) => {
  console.log(req.session);

  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // pass a single post object into the homepage template
      res.render('homepage', { posts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  // loggedIn is a property of the Session object,
  // if its value is true, then redirecto to the homepage
  if(req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});


module.exports = router;