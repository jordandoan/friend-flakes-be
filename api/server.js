const express = require("express");
const helmet = require("helmet");

const userRoutes = require("./users/users-routes");

const server = express();

server.use(helmet());
server.use(express.json());

server.use("/api/users", userRoutes);

module.exports = server;