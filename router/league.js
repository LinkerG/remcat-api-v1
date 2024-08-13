const express = require("express")
const leagueController = require("../controllers/league")

const api = express.Router()

api.get("/league/:season", leagueController.getLeagueBySeason)

module.exports = api