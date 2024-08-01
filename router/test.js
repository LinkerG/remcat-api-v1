const express = require("express")
const testController = require("../controllers/test")

const api = express.Router()

api.get("/test", testController.getTest)
api.post("/test", testController.postTest)

module.exports = api