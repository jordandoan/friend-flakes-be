const express = require("express");
const bcrypt = require("bcryptjs");


const Users = require("./users-model");

const router = express.Router();

router.get("/", restricted, (req,res) => {
  Users.findUsers()
    .then(users => res.status(200).json(users));
});

router.post('/register', validateRegister, (req,res) => {
  req.body.username = req.body.username.toLowerCase();
  const { password } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  req.body.password = hash;
  Users.register(req.body)
    .then(id => res.status(201).json(id))
    .catch(err => errorMsg(res, 500, "Error registering user, try a different username"));
});

router.post('/login', (req,res) => {
  if (req.body) {
    if (req.body.username && req.body.password) {
      req.body.username = req.body.username.toLowerCase();
      Users.findUser(req.body.username)
        .then(user => {
          if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user;
            res.status(201).json({username: user.username});
          } else {
            errorMsg(res, 500, "Incorrect credentials");
          }
        })
        .catch(err => errorMsg(res, 500, "Error logging in"));
    } else {
      errorMsg(res, 400, "Please provide credentials");
    }
  } else {
    errorMsg(res, 400, "Please provide body");
  }
})

function validateRegister(req,res,next) {
  user = req.body;
  if (user) {
    if (!user.username || !user.password || !user.first_name) {
      errorMsg(res, 400, "Please provide a username, password, and first name");
    } else {
      next();
    }
  } else {
    errorMsg(res, 500, "Please provide body");
  }
}

function errorMsg(res, code, msg) {
  res.status(code).json({error: msg});
}

function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'YOU SHALL NOT PASS' });
  }
}

module.exports = router;