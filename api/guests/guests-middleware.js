const helpers = require("../../helpers");
const Events = require("../events/events-model");

module.exports = {
  findEvent,
  validAction
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

}

function validAction(req,res,next) { 
  if (req.found.user_id == req.decoded.id) {
    next();
  } else if (req.body.username.toLowerCase() == req.decoded.username) {
    next();
  } else {
    helpers.errorMsg(res, 403, "You are not authorized to perform this action.");
  }
}