const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const userRoutes = require("./users/users-routes");

const server = express();
server.use(
  session({
    name: 'chickenwang', // default is connect.sid
    secret: 'secret secret secret secret password',
    cookie: {
      maxAge: 1 * 3 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    },
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", userRoutes);

module.exports = server;