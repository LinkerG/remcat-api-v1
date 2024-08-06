const express = require("express")
const cors = require('cors')
const app = express()


// Configuración de express-session
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const apiVersion = "/v1"
const baseRoute = "/api" + apiVersion

// Cargar los middlewares
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

// Cargar rutas
const test = require("../router/test")
const teams = require("../router/teams")
const competitions = require("../router/competitions")
const users = require("../router/users")

// Usar lso middlewares
app.use(baseRoute, apiKeyMiddleware);

// Rutas base
app.use(baseRoute, test)
app.use(baseRoute, teams)
app.use(baseRoute, competitions)
app.use(baseRoute, users)

module.exports = app
