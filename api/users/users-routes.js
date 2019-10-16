const express = require("express");

const Users = require("./users-model");
const helpers = require("../../helpers");

const router = express.Router();

router.get("/", helpers.restricted, (req,res) => {
  Users.findUsers()
    .then(users => res.status(200).json(users));
});

module.exports = router;