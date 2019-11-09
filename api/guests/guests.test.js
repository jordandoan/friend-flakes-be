require('dotenv').config();
const request = require("supertest");
const server = require("../server.js");
const db = require("../../data/dbconfig");

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJ0ZXN0dGVzdCIsImlhdCI6MTU3MzMyMjU2OSwiZXhwIjoxNTczOTI3MzY5fQ.EN_6C1hLQnnmzCs7u-EbSqicS_FOCUQsTjmr5V16m9c";

describe('handles guest endpoints', () => {
  it('adds a guest', async () => {
    await db('event_guests').truncate()
    return request(server).post("/api/guests/1").set({authorization: token}).send({username: "testuser", attended:true})
      .then(res => {
        return expect(res.body.message).toBeTruthy();
      })
  })

  it('returns guests', () => {
    return request(server).get('/api/guests/1').set({authorization: token})
      .then(res => {
        return expect(res.body.guests).toBeTruthy();
      })
  })

  it('edits guests', () => {
    return request(server).put('/api/guests/1/testuser').set({authorization: token}).send({attended: false})
      .then(res => {
        return expect(res.body.message).toBeTruthy();
      })
  })

  // it('deletes guests', () => {
  //   return request(server).delete('/api/guests/1/testuser').set({authorization: token})
  //     .then(res => {
  //       return expect(res.body.message).toBeTruthy();
  //     })
  // })

  it('adds self to an event', async () => {
    return request(server).post("/api/guests/2").set({authorization: token}).send({username: "testtest", attended:true})
      .then(res => {
        return expect(res.body.message).toBeTruthy();
      })
  })
  it('edits', async () => {
    return request(server).put("/api/guests/2/testtest").set({authorization: token}).send({attended:false})
      .then(res => {
        return expect(res.body.message).toBeTruthy();
      })
  })
  it('delete from an event', async () => {
    return request(server).delete("/api/guests/2/testtest").set({authorization: token})
      .then(res => {
        return expect(res.body.message).toBeTruthy();
      })
  })
})



describe('handles failures', () => {
  it('Adding already existing invite', () => {
    return request(server).post("/api/guests/1").set({authorization: token}).send({username: "testuser", attended:true})
      .then(res => {
        return expect(res.body.error).toBeTruthy();
      })
  })

  it('Inviting someone to other event', () => {
    return request(server).post("/api/guests/2").set({authorization: token}).send({username: "testuser", attended:true})
      .then(res => {
        return expect(res.body.error).toBeTruthy();
      })
  })
  it('missing body', () => {
    return request(server).post("/api/guests/1").set({authorization: token}).send({username: "testuser"})
      .then(res => {
        console.log(res.body.error);
        return expect(res.body.error).toBeTruthy();
      })
  })
  it('Editing someone from other event', () => {
    return request(server).put("/api/guests/2/testuser2").set({authorization: token}).send({attended:false})
      .then(res => {
        return expect(res.body.error).toBeTruthy();
      })
  })
  it('Deleting someone from other event', () => {
    return request(server).put("/api/guests/2/testuser2").set({authorization: token})
      .then(res => {
        return expect(res.body.error).toBeTruthy();
      })
  })
  it('Find nonexistent event', () => {
    return request(server).put("/api/guests/1/testuser2").set({authorization: token}).send({attended:false})
      .then(res => {
        return expect(res.body.error).toBeTruthy();
      })
  })
})