const express = require("express");
const route = express.Router();
const controller = require("../controller/controller")

// Match List Route - New API endpoint
route.get("/matches", controller.matchList);
route.get("/matches/:sportId", controller.matchList);

// Match Details Route
route.get("/match-details/:matchId", controller.matchDetails);

module.exports = route