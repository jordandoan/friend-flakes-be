const express = require("express");

const Users = require("./users-model");
const helpers = require("../../helpers");

const router = express.Router();

router.get("/", helpers.restricted, (req,res) => {
  Users.findUsers()
    .then(users => res.status(200).json(users));
});

router.get("/friends", helpers.restricted, (req, res) => {
  Users.getFriends(req.user.id)
    .then(friends => {
      let filteredArray = friends.map(friend => {
        if (friend.accepted) {
          return (friend.request_by == req.user.username ? friend.request_to : friend.request_by)
        }
      })
      res.status(200).json({friend_list: filteredArray});
    });
});

module.exports = router;