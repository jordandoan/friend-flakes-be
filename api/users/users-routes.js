const express = require("express");

const Users = require("./users-model");
const Guests = require("../../api/guests/guests-model");
const fHelpers = require('./users-middleware');
const helpers = require("../../helpers");

const router = express.Router();

router.get("/", (req, res) => {
  Users.findUsers()
    .then(users => res.status(200).json(users))
    .catch(err => helpers.errorMsg(res, 500, "Error retreiving from database"));
});

router.get("/info/:username", fHelpers.verifyUser, (req,res) => {
  Users.findUserByName(req.params.username)
    .then(user => {
      const {password, ...rest} = user;
      if (user) {
        Users.findUserEvents(user.id)
        .then(async events => {
          // const newEvents = {...events}
          const newEvents = await events.map((event) => {
            return Guests.getEventGuests(event.id)
              .then(guests => { 
                return {...event, people: guests.length}
              });
          })
          Promise.all(newEvents)
            .then(newEvents => {
              res.json({...rest, events: newEvents})
            })
        })
      } else {
        helpers.errorMsg(res, 404, "Cannot find user.")
      }
    }) 
    .catch(err => helpers.errorMsg(res, 500, "Error accessing database."));
});

router.get("/friends", (req, res) => {
  Users.getFriends(req.decoded.id)
    .then(friends => {
      let friends_list = [];
      let received_requests = [];
      let sent_requests = [];
      friends.forEach(friend => {
        const rf_name = (friend.rf_fn + " " + (friend.rf_ln || "")).trim();
        const rt_name = (friend.rt_fn + " " + (friend.rt_ln || "")).trim();
        if (friend.accepted) {
          let user = {username: "", name: ""};
          if (friend.request_from == req.decoded.username) { 
            user.username = friend.request_to;
            user.name = rt_name;
          } else {
            user.username = friend.request_from;
            user.name = rf_name;
          }
          friends_list.push(user);
        } else {
          if (friend.request_to == req.decoded.username) {
            received_requests.push({username: friend.request_from, name: rf_name});
          } else {
            sent_requests.push({username: friend.request_to, name: rt_name});
          }
        }
      })
      res.status(200).json({friends_list, received_requests, sent_requests});
    });
});

router.post("/friends", [fHelpers.checkUsers, fHelpers.noRequests], (req, res) => {
  Users.addRequest(req.friend_request)
    .then(length => res.status(201).json({request_to: req.friend.username}))
    .catch(err => helpers.errorMsg(res, 400, "You are friends already or you have a pending request"));
});

// Note: Should I check for accepted friend already?
router.put("/friends/:request_to/:request_from", [fHelpers.authAdd, fHelpers.checkUsers, fHelpers.ifRequestExists], (req, res) => {
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

router.delete("/friends/:username1/:username2", [fHelpers.authDelete, fHelpers.checkUsers, fHelpers.findRequest], (req, res) => {
  Users.remove(req.body)
    .then(records => res.status(201).json({message:"Successfully deleted!"}))
    .catch(err => helpers.errorMsg(res, 500, "Error modifying database")); 
});

module.exports = router;