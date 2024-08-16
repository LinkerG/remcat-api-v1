// Models
const Competition = require("../models/competitions")
const Result = require("../models/results")
// Cache
const { setupCacheAdapter, handleCache } = require("../app/cache")
const cacheAdapter = setupCacheAdapter(5)
// Utils
const sortResults = require("../utils/sortResults")

async function getLeagueBySeason(req, res) {
    console.log("[GET] /api/v/league/:season")

    const season = req.params.season
    const cacheKey = `league-${season}`
    res.set('Cache-Control', 'public, max-age=300') // 5 minutos

    try {
        const leagues = await handleCache(cacheAdapter, cacheKey, () => getLeagueData(season))
        res.status(200).send({ leagues })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: "Internal server error" })
    }

}

async function getLeagueData(season) {
    const startYearInt = parseInt(season, 10)
    const startDate = new Date(`${startYearInt}-01-01`)
    const endDate = new Date(`${startYearInt}-12-31`)

    const competitions = await Competition.find({
        date: { $gte: startDate, $lte: endDate },
        isLeague: true,
    })

    if (!competitions) {
        throw new Error("No competitions found")
    }

    const competitionIds = competitions.map(competition => competition._id)

    const results = await Result.find({
        competition_id: { $in: competitionIds },
        isValid: true,
    })

    if (!results) {
        throw new Error("No results found")
    }

    const leagues = []

    competitions.forEach((competition) => {
        const boatType = competition.boatType
        const resultsForThisCompetition = results.filter(result => result.competition_id == competition._id)

        const resultsByCategory = resultsForThisCompetition.reduce((acc, result) => {
            if (!acc[result.category]) acc[result.category] = []
            acc[result.category].push(result)
            return acc
        }, {})

        Object.entries(resultsByCategory).forEach(([category, categoryResults]) => {
            const sortedResults = sortResults(categoryResults)
            let points = 20

            sortedResults.forEach((result) => {
                const teamName = result.teamShortName

                let league = leagues.find(league => league.boatType === boatType && league.category === category)

                if (!league) {
                    league = {
                        boatType,
                        category,
                        teamSummary: [],
                    }
                    leagues.push(league)
                }

                let team = league.teamSummary.find(team => team.teamName === teamName)

                if (!team) {
                    team = { teamName, points }
                    league.teamSummary.push(team)
                } else {
                    team.points += points
                }

                points = Math.max(points - 1, 0)
            })
        })
    })

    return leagues
}

module.exports = {
    getLeagueBySeason,
    getLeagueData
}
