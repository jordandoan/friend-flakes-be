require('dotenv').config();
const request = require("supertest");
const server = require("./server.js");
const db = require("../data/dbconfig");

let token = "";
describe('testing auth endpoints', () => {
    db('users').del().where({username: "testtest"})
    it('returns an id: register successful', () => {
        return request(server).post('/api/auth/register').send({ username: "testtest", password: "password", first_name: "jordan"})
            .then(res => {
                return expect(res.body).toBeTruthy();
            })
    })
    it('returns a token: login successful', () => {
        return request(server).post('/api/auth/login').send({ username: "testtest", password: "password" })
            .then(res => {
                token = res.body.token;
                console.log(res.body);
                return expect(res.body.token).toBeTruthy();
            })
    })
})