const helpers = require("../../helpers");
const Events = require("./events-model");

module.exports = {
  validateEvent,
  findEvent,
  isOwner
}

function validateEvent(req,res,next) {
  const {date, title, points} = req.body;
  const event = {date, title, points};
  if (event) {
    if (event.title && event.date && event.points) {
      req.event = event;
      next();
    } else {
      helpers.errorMsg(res, 400, "Title, date, and value is required.")
    }
  } else {
    helpers.errorMsg(res, 400, "Body is required.")
  }
}

function findEvent(req,res,next) {
  Events.getById(req.params.id)
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

function isOwner(req,res,next) { 
  if (req.found.user_id == req.decoded.id) {
    next();
  } else {
    helpers.errorMsg(res, 403, "You are not authorized to perform this action.");
  }
}