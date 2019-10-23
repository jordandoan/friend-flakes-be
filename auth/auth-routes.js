const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model");
const secrets = require("../secrets");
const helpers = require("../helpers");

const router = express.Router();

router.post('/register', validateRegister, (req,res) => {
  req.body.username = req.body.username.toLowerCase();
  const { password } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  req.body.password = hash;
  Users.register(req.body)
    .then(id => res.status(201).json(id))
    .catch(err => helpers.errorMsg(res, 500, "Error registering user, try a different username"));
});

router.post('/login', (req,res) => {
  if (req.body) {
    if (req.body.username && req.body.password) {
      req.body.username = req.body.username.toLowerCase();
      Users.findUser(req.body.username)
        .then(user => {
          if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = generateToken(user);
            res.status(201).json({token});
          } else {
            helpers.errorMsg(res, 500, "Incorrect credentials");
          }
        })
        .catch(err => helpers.errorMsg(res, 500, "Error logging in"));
    } else {
      helpers.errorMsg(res, 400, "Please provide credentials");
    }
  } else {
    helpers.errorMsg(res, 400, "Please provide body");
  }
})

function validateRegister(req,res,next) {
  user = req.body;
  if (user) {
    if (!user.username || !user.password || !user.first_name) {
      helpers.errorMsg(res, 400, "Please provide a username, password, and first name");
    } else {
      next();
    }
  } else {
    helpers.errorMsg(res, 500, "Please provide body");
  }
}

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

module.exports = router;