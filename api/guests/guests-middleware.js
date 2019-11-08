const helpers = require("../../helpers");
const Events = require("../events/events-model");
const Users = require("../users/users-model");

module.exports = {
  findEvent,
  validAction,
  findUser
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
  let username = req.body.username || req.params.id.username
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
  } else if (req.body.username.toLowerCase() == req.decoded.username) {
    next();
  } else {
    helpers.errorMsg(res, 403, "You are not authorized to perform this action.");
  }
}