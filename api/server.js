const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("../auth/auth-routes");
const userRoutes = require("./users/users-routes");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRoutes);
server.use("/api/users", userRoutes);

module.exports = server;