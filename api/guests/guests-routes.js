const express = require("express");

const Guests = require("./guests-model");
const gHelpers = require("./guests-middleware");
const helpers = require("../../helpers");

const router = express.Router();

// Anyone can get this
router.get('/:event_id', gHelpers.findEvent, (req,res) => {
  Guests.getEventGuests(req.params.event_id)
    .then(guests => res.status(200).json({guests}))
});

// Owners can add people, people can add themselves
// {username: String, attended: Bool}
router.post('/:event_id', [gHelpers.findEvent, gHelpers.findUser, gHelpers.validAction], (req,res) => {
  let guest = {event_id: req.params.event_id, user_id: req.user.id, attended: req.body.attended};
  Guests.addGuest(guest)
    .then(length => res.status(200).json({message: `${req.body.username} has been invited`}))
    .catch(err => helpers.errorMsg(res, 500, "Error adding to database"));
});

// Owners can edit status, people can edit their own status
router.put('/:event_id/:username', [gHelpers.findEvent, gHelpers.validAction, gHelpers.findUser], (req,res) => {
  let guest = {event_id: req.params.event_id, user_id: req.user.id, attended: req.body.attended};
  Guests.updateGuest(guest)
    .then(length => res.status(200).json({message: `${req.body.username} has been updated`}))
    .catch(err => helpers.errorMsg(res, 500, "Error updating database"));
});

// Owners can delete users, people can delete themselves from events
router.delete('/:event_id/:username', [gHelpers.findEvent, gHelpers.validAction, gHelpers.findUser], (req,res) => {
  Guests.removeGuest(req.params.event_id, req.params.username)
  .then(length => res.status(200).json({message: `${req.params.username} has been removed`}))
  .catch(err => helpers.errorMsg(res, 500, "Error deleting from database"));
});

module.exports = router;