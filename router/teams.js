const express = require("express")
const teamController = require("../controllers/teams")

const api = express.Router()

api.get("/teams", teamController.getTeams)
api.post("/teams", teamController.postTeams)
api.get("/teams/:name", teamController.getTeam)
api.patch("/teams/:id", teamController.patchTeam)

module.exports = api