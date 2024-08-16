const express = require("express");
const teamController = require("../controllers/teams");

const imageMiddleware = require("../middlewares/teamImageMiddleware")

const api = express.Router();

api.get("/teams", teamController.getTeams);
api.post("/teams", imageMiddleware.any(), teamController.postTeams);
api.get("/teams/:name", teamController.getTeam);
api.get("/teams/:name/resume", teamController.getTeamResume);
api.patch("/teams/:id", teamController.patchTeam);

module.exports = api;
