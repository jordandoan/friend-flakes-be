const express = require("express");

const Events = require("./events-model");
const eHelpers = require("./events-middleware");
const helpers = require("../../helpers");

const router = express.Router();

router.get('/', (req,res) => {
  Events.getAll()
    .then(events => res.status(200).json(events))
    .catch(err => helpers.errorMsg(res, 500, "Error retrieving from database"))
});

router.get('/:id', eHelpers.findEvent, (req,res) => {
  res.status(200).json(req.found)
})

router.post('/', eHelpers.validateEvent, (req,res) => {
  Events.add(req.event)
    .then(id => res.status(201).json({id}))
    .catch(err => helpers.errorMsg(res, 500, "Error uploading to database"))
})

router.put('/:id', [eHelpers.findEvent, eHelpers.isOwner, eHelpers.validateEvent], (req,res) => {
  Events.edit(req.params.id, event)
    .then(records => res.status(201).json({records}))
    .catch(err => helpers.errorMsg(res, 500, "Error updating database"))
})

router.delete('/:id', [eHelpers.findEvent, eHelpers.isOwner], (req,res) => {
  Events.delete(req.params.id)
    .then(records => res.status(201).json({records}))
    .catch(err => helpers.errorMsg(res, 500, "Error updating database"));
})

module.exports = router;