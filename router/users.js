const express = require("express")
const userController = require("../controllers/users")

const api = express.Router()

//api.get("/users", userController.po)
api.post("/users", userController.postUser)
api.get("/users/keys", userController.getApiKeys)
api.put("/users/:id/generateKey", userController.generateApiKey)

module.exports = api