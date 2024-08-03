const express = require("express")
const cors = require('cors')
const app = express()

// Configuración de express-session
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const apiVersion = "/v1"
const baseRoute = "/api" + apiVersion

//Cargar rutas
const test = require("../router/test")
const teams = require("../router/teams")
const competitions = require("../router/competitions")

//Rutas base
app.use(baseRoute, test)
app.use(baseRoute, teams)
app.use(baseRoute, competitions)

module.exports = app
