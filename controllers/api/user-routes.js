const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({
      // attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      // include the Comment model here:
      // Notice that in contrast to the get all posts route,
      // in this instance we include a reference to the Post model's
      // 'title' field, i.e. the title of the post. So when we query
      // a particular user, we'll get back the title of all the posts
      // that user has commented on
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// POST /api/users
router.post('/', withAuth, (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
      // Pass in key/value pairs where the keys are what we 
      // defined in the User model and the values are what
      // we get from req.body.
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
    .then(dbUserData => {
      // We want to make sure the session is created before
      // we send the response back, so we're wrapping the
      // variables in a callback. The req.session.save() method
      // will initiate the creation of the session and then run
      // the callback function once complete.
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
    
        res.json(dbUserData);
      });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users/login, for authenticating login
router.post('/login', withAuth, (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
      where: {
        email: req.body.email
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
  
      // Verify user
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
      
      req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        // if entered password matches hashed password, send back the following
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });  
});

router.post('/logout', withAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
})

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This .update() method combines the parameters for creating data and looking up data.
    // We pass in req.body to provide the new data we want to use in the update and req.params.id
    // to indicate where exactly we want that new data to be used.
    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    let uname;
    let uid = req.params.id

    User.findOne({
      attributes: { exclude: ['email', 'password'] },
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
      uname = dbUserData.dataValues.username;
    });     

    User.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(`User ${uname} with id ${uid} has been deleted.`);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;