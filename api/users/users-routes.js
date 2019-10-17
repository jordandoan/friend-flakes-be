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

router.post("/friends", [checkUsers, checkRequest], (req,res) => {
  Users.addRequest(req.friend_request)
    .then(length => res.status(201).json({request_to: req.friend.username}))
    .catch(err => helpers.errorMsg(res, 400, "You are friends already or you have a pending request"));
});

/*
  Checks if both users in request exist. If so, moves on to next check for any existing status between the two users
  Request Body: {
    request_from: @string (username)
    request_by: @string (username)
  }
*/
async function checkUsers(req, res, next) {
  const request = req.body;
  const request_from = await Users.findUserByName(request.request_from)
  const request_to = await Users.findUserByName(request.request_to)
  if (request_to && request_from ) {
    req.friend = {username: request.request_to};
    request.request_from = request_from.id;
    request.request_to = request_to.id;
    next();
  } else {
    helpers.errorMsg(res, 400, "Cannot find one or both users");
  }
}

function checkRequest(req,res,next) {
  const frReq = req.body;
  // Check to see if friend request is sent by other person
  const other = {request_from: frReq.request_to, request_to: frReq.request_from}
  Users.findRequest(other)
    .then(request => {
      // Two possible cases for request: Already friends, or pending request from other person
      if (request) {
        if (request.accepted) {
        helpers.errorMsg(res,400, "You are already friends with this person.")
        } else {
          helpers.errorMsg(res, 400, "Person has already sent you a friend request.")
        }
      } else {
        req.friend_request = frReq;
        req.friend_request.accepted = false;
        next();
      }
    })
    .catch(err => helpers.errorMsg(res, 500, "Error accessing database"))
}
module.exports = router;