const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("../auth/auth-routes");
const userRoutes = require("./users/users-routes");
const eventRoutes = require("./events/events-routes");
const guestRoutes = require("./guests/guests-routes");
const helpers = require("../helpers");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req,res) => {
  res.send("Welcome to the root!");
})

server.use("/api/auth", authRoutes);
server.use(helpers.verifyToken);
server.use("/api/users", userRoutes);
server.use("/api/events", eventRoutes);
server.use("/api/guests", guestRoutes);

module.exports = server;