const express = require("express")
const competitionController = require("../controllers/competitions")
const resultsController = require("../controllers/results")

const api = express.Router()

api.get("/competitions", competitionController.getCompetitions)
api.post("/competitions", competitionController.postCompetition)
api.post("/competitions/query", competitionController.query)
api.get("/competitions/season/:season", competitionController.getCompetitionsBySeason)
api.get("/competitions/years", competitionController.getAllYears)
api.get("/competitions/nextCompetitions", competitionController.getNextCompetitions)
api.get("/competitions/slug/:slug", competitionController.getCompetitionBySlug)
api.get("/competitions/:id", competitionController.getCompetitionById)
// Resultados de una competicion
api.get("/competitions/:id/results", resultsController.getResultsFromCompetition)
api.post("/competitions/:id/results", resultsController.postResult)
api.post("/competitions/:id/results/updateTimes", resultsController.updateTimes)
api.post("/competitions/:id/results/processFinals", resultsController.processFinals)

api.patch("/competitions/:id", competitionController.patchCompetition)

module.exports = api
