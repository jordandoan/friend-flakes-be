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
      let friends_list = [];
      let received_requests = [];
      let sent_requests = [];
      friends.forEach(friend => {
        const rf_name = (friend.rf_fn + " " + (friend.rf_ln || "")).trim();
        const rt_name = (friend.rt_fn + " " + (friend.rt_ln || "")).trim();
        if (friend.accepted) {
          let user = {username: "", name: ""};
          if (friend.request_from == req.user.username) { 
            user.username = friend.request_to;
            user.name = rt_name;
          } else {
            user.username = friend.request_from;
            user.name = rf_name;
          }
          friends_list.push(user);
        } else {
          if (friend.request_to == req.user.username) {
            received_requests.push({username: friend.request_from, name: rf_name});
          } else {
            sent_requests.push({username: friend.request_to, name: rt_name});
          }
        }
      })
      res.status(200).json({friends_list, received_requests, sent_requests});
    });
});

router.post("/friends", [checkUsers, noRequests], (req,res) => {
  Users.addRequest(req.friend_request)
    .then(length => res.status(20).json({request_to: req.friend.username}))
    .catch(err => helpers.errorMsg(res, 400, "You are friends already or you have a pending request"));
});

// Note: Should I check for accepted friend already?
router.put("/friends/:request_to/:request_from", [helpers.verifyToken, authAdd, checkUsers, ifRequestExists], (req,res) => {
  if (req.body.accepted) {
    Users.acceptRequest(req.body)
      .then(records => {
        res.status(202).json({records: records});
      })
      .catch(err => helpers.errorMsg(res, 500, "Error modifying database"))
  } else {
    helpers.errorMsg(res, 400, "Incorrect body for accepting friend request");
  }
});

router.delete("/friends/:username1/:username2", [helpers.verifyToken, authDelete, checkUsers, findRequest], (req,res) => {
  Users.remove(req.body)
    .then(records => res.status(201).json({message:"Successfully deleted!"}));
    
});

function authAdd(req,res,next) {
  const decodedToken = req.decoded;
  if (decodedToken.username == req.params.request_to) {
    req.body = {...req.body, request_to: req.params.request_to, request_from: req.params.request_from}
    next();
  } else {
    helpers.errorMsg(res, 401, "You are unauthorized to make this action.");
  }
}

function authDelete(req,res,next) {
  const decodedToken = req.decoded;
  if (decodedToken.username == req.params.username1 || decodedToken.username == req.params.username2) {
    req.body = {request_from: req.params.username1, request_to: req.params.username2}
    next();
  } else {
    helpers.errorMsg(res, 401, "You are unauthorized to make this action.");
  }
}

/*
  Checks if both users in request exist. If so, moves on to next check for any existing status between the two users
  Request Body: {
    request_from: @string (username)
    request_to: @string (username)
  }
*/
async function checkUsers(req, res, next) {
  const frReq = req.body;
  const user_from = await Users.findUserByName(frReq.request_from)
  const user_to = await Users.findUserByName(frReq.request_to)
  if ((user_to && user_from) && (user_to.id != user_from.id) ) {
    frReq.request_from = user_from.id;
    frReq.request_to = user_to.id;
    next();
  } else {
    helpers.errorMsg(res, 400, "Cannot find one or both users");
  }
}

async function findRequest(req, res, next) {
  const frReq = req.body;
  const other = {request_from: frReq.request_to, request_to: frReq.request_from}
  const firstSearch =  await Users.findRequest(frReq)
  const secondSearch = await Users.findRequest(other)
  if (firstSearch) {
    next();
  } else if (secondSearch) {
    req.body = other;
    next();
  } else {
    helpers.errorMsg(res, 400, "Friend request does not exist")
  }
}

function ifRequestExists(req, res, next) {
  const frReq = req.body;
  Users.findRequest(frReq)
    .then(request => {
      if (request) {
        next();
      } else {
        helpers.errorMsg(res, 400, "Friend request does not exist")
      }
    })
    .catch(err => helpers.errorMsg(res, 500, "Error accessing database"));
}

function noRequests(req,res,next) {
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