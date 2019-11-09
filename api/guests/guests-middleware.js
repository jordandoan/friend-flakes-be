const helpers = require("../../helpers");
const Events = require("../events/events-model");
const Users = require("../users/users-model");
const Guests = require("./guests-model");

module.exports = {
  findEvent,
  validAction,
  findUser,
  findInvite,
  validateInvite
}

function findEvent(req,res,next) {
  Events.getById(req.params.event_id)
    .then(event => {
      if (event) {
        req.found = event;
        next();
      } else {
        helpers.errorMsg(res, 404, "Event with specified ID not found.");
      }
    })
    .catch(err => helpers.errorMsg(res, 500, "Error accessing database."));
}

function findUser(req, res, next) {
  let username = req.body.username || req.params.username
  username = username.toLowerCase();
  Users.findUserByName(username)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        helpers.errorMsg(res, 404, "Cannot find user");
      }
    })
    .catch(err => helpers.errorMsg(res, 500, "Error accessing database."));
}

function validAction(req,res,next) { 
  // Checks user id with owner
  if (req.found.user_id == req.decoded.id) {
    next();
  // Checks if user you are sending is your user
  } else if (req.user.username.toLowerCase() == req.decoded.username) {
    next();
  } else {
    helpers.errorMsg(res, 403, "You are not authorized to perform this action.");
  }
}

function validateInvite(req, res, next) {
  let username = req.body.username || req.params.username;
  let attended = req.body.attended;
  if (!username || attended == undefined) {
    helpers.errorMsg(res, 500, "username required in body (POST) or params (PUT), attended required in body")
  } else {
    next();
  }
}

function findInvite(req, res, next) {
  Guests.findInvite(req.params.event_id, req.user.id)
    .then(invite => {
      if (invite) {
        next();
      } else {
        helpers.errorMsg(res, 404, "Invite not found")
      }
    })
    .catch(err => helpers.errorMsg(res, 500, "Error accessing database."));
}