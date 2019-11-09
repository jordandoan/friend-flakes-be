require('dotenv').config();
const request = require("supertest");
const server = require("./server.js");
const db = require("../data/dbconfig");

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJ0ZXN0dGVzdCIsImlhdCI6MTU3MzMyMjU2OSwiZXhwIjoxNTczOTI3MzY5fQ.EN_6C1hLQnnmzCs7u-EbSqicS_FOCUQsTjmr5V16m9c";
describe('testing auth endpoints', () => {
    // db('users').del().where({username: "testtest"})
    // it('returns an id: register successful', () => {
    //     return request(server).post('/api/auth/register').send({ username: "testtest", password: "password", first_name: "jordan"})
    //         .then(res => {
    //             return expect(res.body).toBeTruthy();
    //         })
    // })
    // it('returns a token: login successful', () => {
    //     return request(server).post('/api/auth/login').send({ username: "testtest", password: "password" })
    //         .then(res => {
    //             token = res.body.token;
    //             // console.log(res.body.token);
    //             return expect(res.body.token).toBeTruthy();
    //         })
    // })
})

describe('adding events', () => {
  it ('returns events', async () => {
    return request(server).get('/api/events').set({authorization: token})
      .then(res => {
        return expect(res.body.events).toBeTruthy();
      })
  })
  // it('returns nothing', async () => {
  //   await db('events').truncate();
  //   return request(server).get('/api/events').set({authorization: token})
  //     .then(res => {
  //       return expect(res.body.events.length).toBe(0)
  //     })
  // })
  // it('returns status code 201', () => {
  //   return request(server).post('/api/events/5555').set({authorization: token}).send({title: 'Friendsgiving', date:'10/29/19', points: 5})
  //     .then(res => {
  //       console.log(res.body);
  //       return expect(res.status).toBe(201)
  //     })
  // })
  // it('returns a truthy length of events', () => {
  //   return request(server).get('/api/events').set({authorization: token})
  //     .then(res => {
  //       return expect(res.body.events.length).toBeTruthy()
  //     })
  // })
  // it('returns records', () => {
  //   return request(server).put('/api/events/1').set({authorization: token}).send({title: 'Friendsgiving', date:'10/29/19', points: 10})
  //     .then(res => {
  //       return expect(res.body.records).toBeTruthy()
  //     })
  // })
  // it('returns records', () => {
  //   return request(server).delete('/api/events/1').set({authorization: token})
  //     .then(res => {
  //       return expect(res.body.records).toBeTruthy()
  //     })
  // })
})
