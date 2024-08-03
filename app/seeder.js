const mongoose = require("mongoose")
require('dotenv').config()
const urlMongoAtlas = process.env.MONGO_URI

const Team = require("../models/teams")
const teams = require('../models/mocks/teams')
const Competition = require("../models/competitions")
const competitions = require('../models/mocks/competitions')
const Result = require("../models/results")
const fakeTime = require("../utils/fakeTime")

console.log("[RemCat] Starting seeding process\n")

console.log("[RemCat] Connecting to remote database\n")
mongoose.connect(urlMongoAtlas, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('error', (err) => {
    console.error('[RemCat] MongoDB connection error:', err)
})

mongoose.connection.once('open', async () => {
    console.log("\n[RemCat] MongoDB connection successful\n")

    console.log("[RemCat] Seeding teams collection")
    await seedTeams()

    console.log("[RemCat] Seeding competitions collection")
    // Hay que recuperar las competiciones insertadas para usar la id en los resultados
    const insertedCompetitions = await seedCompetitions()

    console.log("[RemCat] Seeding results collection")
    await seedResults(insertedCompetitions)

    console.log("[RemCat] Seeding data completed!")

    process.exit(0)
})

async function seedTeams() {
    await Team.deleteMany({})
    await Team.insertMany(teams)
    console.log(`[RemCat] Inserted ${teams.length} new teams\n`)
}

async function seedCompetitions() {
    await Competition.deleteMany({})
    const insertedCompetitions = await Competition.insertMany(competitions)
    console.log(`[RemCat] Inserted ${competitions.length} new competitions\n`)

    return insertedCompetitions
}

async function seedResults(insertedCompetitions) {
    // En esta variable definiremos las categorías de las que queremos mockear los datos
    const categories = ["SM", "SF"]
    console.log(`[RemCat] Seeding with ${categories.length} categories: ${categories}`)

    let results = []
    insertedCompetitions.forEach((competition, i) => {
        console.log(`[RemCat] Seeding competition ${i + 1}: ${competition.name}`)
        for (category of categories) {
            for (team of teams) {
                const result = {
                    competition_id: competition._id,
                    teamShortName: team.shortName,
                    category: category,
                    time: fakeTime(4, 7),
                }
                results.push(result)
            }
        }
    })

    await Result.deleteMany({})
    await Result.insertMany(results)
    console.log(`[RemCat] Inserted ${results.length} new results\n`)
}
