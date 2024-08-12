const Competition = require("../models/competitions")
const Result = require("../models/results")

async function getLeagueBySeason(req, res) {
    console.log("[GET] /api/v/league/:season")
    const season = req.params.season
    const startYearInt = parseInt(season, 10)

    const startDate = new Date(`${startYearInt}-01-01`)
    const endDate = new Date(`${startYearInt}-12-31`)
    try {
        const competitions = await Competition.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
        if (!competitions) res.status(400).send({ msg: "Error fetching competitions" })
        else res.status(200).send({ competition: competition })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}