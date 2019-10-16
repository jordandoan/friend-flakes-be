const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const userRoutes = require("../auth/users/users-routes");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", userRoutes);

module.exports = server;