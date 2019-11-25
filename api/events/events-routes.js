const express = require("express");

const Events = require("./events-model");
const Guests = require("../guests/guests-model");
const eHelpers = require("./events-middleware");
const helpers = require("../../helpers");

const router = express.Router();

router.get('/', (req,res) => {
  Events.getAll()
    .then(events => res.status(200).json({events}))
    .catch(err => helpers.errorMsg(res, 500, "Error retrieving from database"));
});

router.get('/:id', (req,res) => {
  Events.getInfobyId(req.params.id)
    .then(event => {
      if (event) {
        let {first_name, last_name, ...rest} = event;
        last_name = " " || last_name;
        rest.full_name = (first_name + " "  + last_name).trim();
        Guests.getEventGuests(req.params.id)
          .then(guests => {
            let newGuests = guests.map(guest => {
              let {first_name, last_name, ...rest} = guest;          
              last_name = " " || last_name;
              rest.full_name = (first_name + " "  + last_name).trim();
              return rest
            })
            res.json({...rest, guests: newGuests})
          })
          .catch(err => helpers.errorMsg(res, 500, "Error accessing data base"));
      }  else {
        helpers.errorMsg(res, 404, "Cannot find event with specified ID.");
      }
    })
    .catch(err => helpers.errorMsg(res, 500, "Error retrieving from database"))
})

router.post('/', eHelpers.validateEvent, (req,res) => {
  Events.add({user_id: req.decoded.id, ...req.event})
    .then(id => res.status(201).json({id, user_id: req.decoded.id}))
    .catch(err => helpers.errorMsg(res, 500, "Error uploading to database"))
})

router.put('/:id', [eHelpers.findEvent, eHelpers.isOwner, eHelpers.validateEvent], (req,res) => {
  Events.edit(req.params.id, req.event)
    .then(records => res.status(201).json({records}))
    .catch(err => helpers.errorMsg(res, 500, "Error updating database"))
})

router.delete('/:id', [eHelpers.findEvent, eHelpers.isOwner], (req,res) => {
  Events.remove(req.params.id)
    .then(records => res.status(201).json({records}))
    .catch(err => helpers.errorMsg(res, 500, "Error updating database"));
})

module.exports = router;