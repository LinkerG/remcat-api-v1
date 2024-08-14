const Competition = require("../models/competitions")
const stringToSlug = require("../utils/stringToSlug")
const setupCacheAdapter = require("../app/cache")
const cacheAdapter = setupCacheAdapter(15);
const longCache = setupCacheAdapter(24 * 60)

async function getCompetitions(req, res) {
    console.log("[GET] /api/v/competitions")
    const cacheKey = "competitions"
    const cacheData = cacheAdapter.get(cacheKey)

    if (cacheData) {
        console.log("Cached ✅")
        res.status(200).send({ competitions: cacheData })
    } else {
        const onlyActives = req.query.onlyActives === 'true'

        try {
            let filter = {}
            if (onlyActives) {
                filter.isActive = true
            }

            const competitions = await Competition.find(filter).sort({ created_at: -1 })

            if (!competitions || competitions.length === 0) {
                res.status(404).send({ msg: "No competitions found" })
            } else {
                cacheAdapter.set(cacheKey, competitions)
                res.status(200).send({ competitions: competitions })
            }
        } catch (error) {
            res.status(500).send({ msg: "Internal server error", error })
            console.error(error)
        }
    }
}

async function getCompetitionById(req, res) {
    console.log("[GET] /api/v/competitions/:id")
    const id = req.params.id
    try {
        const competition = await Competition.findById(id)

        if (!competition) res.status(400).send({ msg: "Competition not found" })
        else res.status(200).send({ competition: competition })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function getCompetitionBySlug(req, res) {
    console.log("[GET] /api/v/competitions/:slug")
    const slug = req.params.slug
    try {
        const competition = await Competition.findOne({ slug: slug })

        if (!competition) res.status(400).send({ msg: "Competition not found" })
        else res.status(200).send({ competition: competition })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function postCompetition(req, res) {
    console.log("[POST] /api/v/competitions")

    const newCompetition = new Competition()
    const params = req.body

    // Manage date for correct values
    let localDate = new Date(params.date)
    let utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()))

    newCompetition.name = params.name
    newCompetition.slug = stringToSlug(params.name)
    newCompetition.location = params.location
    newCompetition.date = utcDate
    newCompetition.boatType = params.boatType
    newCompetition.lines = params.lines
    newCompetition.lineDistance = params.lineDistance
    params.isLeague ? newCompetition.isLeague = params.isLeague : newCompetition.isLeague = false
    params.isChampionship ? newCompetition.isChampionship = params.isChampionship : newCompetition.isChampionship = false

    try {
        const competition = await newCompetition.save()

        if (!competition) res.status(400).send({ msg: "Error creating competition" })
        else res.status(200).send({ competition: competition })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function patchCompetition(req, res) {
    console.log("[PATCH] /api/v/competitions/:id")

    const id = req.params.id

    try {
        if (req.body.date) {
            let localDate = new Date(req.body.date)
            let utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()))
            req.body.date = utcDate
        }
        const competition = await Competition.findByIdAndUpdate(id, req.body)
        const newCompetition = await Competition.findById(id)
        if (!competition) res.status(400).send({ msg: "Error updating competition" })
        else res.status(200).send({ old: competition, new: newCompetition })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function getCompetitionsBySeason(req, res) {
    console.log("[GET] /api/v/competitions/season/:season");
    const season = req.params.season;

    const cacheKey = "competitions" + season
    const cacheData = cacheAdapter.get(cacheKey)

    if (cacheData) {
        console.log("Cached ✅")
        res.status(200).send({ competitions: cacheData })
    }
    else {
        const startYearInt = parseInt(season, 10);

        const startDate = new Date(`${startYearInt}-01-01`);
        const endDate = new Date(`${startYearInt}-12-31`);

        try {
            const competitions = await Competition.find({
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            if (!competitions) res.status(400).send({ msg: "Error fetching competitions" })
            else {
                cacheAdapter.set(cacheKey, competitions)
                res.status(200).send({ competitions: competitions });
            }
        } catch (error) {
            res.status(500).send(error);
            console.error(error)
        }
    }

}

async function getNextCompetitions(req, res) {
    console.log("[GET] /api/v/competitions/nextCompetitions")

    try {
        const now = new Date()
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

        const competitions = await Competition.find({
            date: {
                $gte: today
            }
        }).sort({ date: 1 })

        if (!competitions) {
            return res.status(400).send({ msg: "No upcoming competitions found" })
        }

        return res.status(200).send({ competitions: competitions })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function getAllYears(req, res) {
    console.log("[GET] /api/v/competitions/years");
    const cacheKey = "years"

    const cacheData = longCache.get(cacheKey)
    if (cacheData) {
        console.log("Cached ✅")
        res.status(200).json(cacheData.map(item => item.year))
    } else {
        try {
            const years = await Competition.aggregate([
                {
                    $group: {
                        _id: { $year: "$date" }
                    }
                },
                {
                    $sort: { "_id": 1 }
                },
                {
                    $project: {
                        _id: 0,
                        year: "$_id"
                    }
                }
            ]);

            if (!years) res.status(400).send({ msg: "Error fetching years" })
            else {
                longCache.set(cacheKey, years)
                res.status(200).json(years.map(item => item.year));
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

async function query(req, res) {
    console.log("[POST] /api/v/competitions/query")

    try {
        const {
            name,
            location,
            date,
            boatType,
            lines,
            lineDistance,
            isCancelled,
            isLeague,
            isChampionship,
            isActive,
        } = req.body

        let filter = {}

        if (name) filter.name = { $regex: new RegExp(name, 'i') }
        if (location) filter.location = { $regex: new RegExp(location, 'i') }
        if (date) {
            const dateObj = new Date(date)
            filter.date = { $gte: dateObj.setHours(0, 0, 0, 0), $lt: dateObj.setHours(23, 59, 59, 999) }
        }
        if (boatType) filter.boatType = boatType
        if (lines) filter.lines = lines
        if (lineDistance) filter.lineDistance = lineDistance
        if (isCancelled) filter.isCancelled = isCancelled
        if (isLeague) filter.isLeague = isLeague
        if (isChampionship) filter.isChampionship = isChampionship
        if (isActive) filter.isActive = isActive

        const competitions = await Competition.find(filter)

        if (!competitions || competitions.length === 0) {
            res.status(404).send({ msg: "No competitions found" })
        } else {
            res.status(200).send({ competitions: competitions })
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error })
        console.error(error)
    }
}

module.exports = {
    getCompetitions,
    getCompetitionById,
    getCompetitionBySlug,
    postCompetition,
    patchCompetition,
    getCompetitionsBySeason,
    getAllYears,
    getNextCompetitions,
    query,
}
