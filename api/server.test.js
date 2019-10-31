require('dotenv').config();
const request = require("supertest");
const server = require("./server.js");
const db = require("../data/dbconfig");

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dGVzdCIsImlhdCI6MTU3MjQ1ODc2NywiZXhwIjoxNTczMDYzNTY3fQ.YrEg-EO9HvVnVxHflq5dBXSwKR05qwhVcUlqkmI02s0";
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
    //             // console.log(res.body);
    //             return expect(res.body.token).toBeTruthy();
    //         })
    // })
})

describe('adding events', () => {
  it('returns nothing', async () => {
    await db('events').truncate();
    return request(server).get('/api/events').set({authorization: token})
      .then(res => {
        return expect(res.body.events.length).toBe(0)
      })
  })
  it('returns status code 201', () => {
    return request(server).post('/api/events').set({authorization: token}).send({title: 'Friendsgiving', date:'10/29/19', points: 5})
      .then(res => {
        return expect(res.status).toBe(201)
      })
  })
  it('returns a truthy length of events', () => {
    return request(server).get('/api/events').set({authorization: token})
      .then(res => {
        return expect(res.body.events.length).toBeTruthy()
      })
  })
  it('returns records', () => {
    return request(server).put('/api/events/1').set({authorization: token}).send({title: 'Friendsgiving', date:'10/29/19', points: 10})
      .then(res => {
        return expect(res.body.records).toBeTruthy()
      })
  })
  it('returns records', () => {
    return request(server).delete('/api/events/1').set({authorization: token})
      .then(res => {
        return expect(res.body.records).toBeTruthy()
      })
  })
})