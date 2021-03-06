const Users = require("./users-model");
const helpers = require("../../helpers");

module.exports = {
  authAdd,
  authDelete,
  checkUsers,
  findRequest,
  ifRequestExists,
  noRequests,
  verifyUser,
}

function verifyUser(req,res, next) {
  if (req.params.username == req.decoded.username) {
    next();
  } else {
    helpers.errorMsg(res, 403, "You are not authorized to perform this action");
  }
}
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
        if (request.accepted) {
          helpers.errorMsg(res, 403, "You are already friends with this user.")
        } else {
          next();
        }
      } else {
        helpers.errorMsg(res, 404, "Friend request does not exist")
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