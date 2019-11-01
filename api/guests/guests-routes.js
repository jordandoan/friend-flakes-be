const express = require("express");

const Guests = require("./guests-model");
const gHelpers = require("./guests-middleware");
const helpers = require("../../helpers");

const router = express.Router();

router.use(gHelpers.findEvent);

// Anyone can get this
router.get('/:event_id', gHelpers.findEvent, (req,res) => {
  Guests.getEventGuests(req.params.event_id)
    .then(guests => res.status(200).json({guests}))
});

// Owners can add people, people can add themselves
// {username: String, attended: Bool}
router.post('/:event_id', [gHelpers.findEvent, gHelpers.validAction], (req,res) => {

})

// Owners can edit status, people can edit their own status
router.put('/:event_id/:username', [gHelpers.findEvent, gHelpers.validAction], (req,res) => {

})

// Owners can delete users, people can delete themselves from events
router.delete('/:event_id/:username', [gHelpers.findEvent, gHelpers.validAction], (req,res) => {

})

module.exports = router;