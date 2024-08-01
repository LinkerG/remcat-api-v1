const Competition = require("../models/competitions")
const Result = require("../models/results")

async function getCompetitions(req, res) {
    console.log("GET /api/v/competitions")

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
            res.status(200).send({competitions: competitions})
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error })
        console.error(error)
    }
}


async function getCompetition(req,res){
    console.log("GET /api/v/competitions/:id")
    const id = req.params.id
    try {
        const competition = await Competition.findById(id)
        
        if(!competition) res.status(400).send({msg:"Competition not found"})
        else res.status(200).send({competition: competition})
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function postCompetition(req, res) {
    console.log("POST /api/v/competitions")

    const newCompetition = new Competition()
    const params = req.body
    
    // Manage date for correct values
    let localDate = new Date(params.date)
    let utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()))

    newCompetition.name = params.name
    newCompetition.location = params.location
    newCompetition.date = utcDate
    newCompetition.boatType = params.boatType
    newCompetition.lines = params.lines
    newCompetition.lineDistance = params.lineDistance

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
    console.log("PATCH /api/v/competitions/:id")

    const id = req.params.id
    
    try {
        const competition = await Competition.findByIdAndUpdate(id, req.body)
        const newCompetition = await Competition.findById(id)
        if (!competition) res.status(400).send({ msg: "Error updating competition" })
        else res.status(200).send({ old: competition, new: newCompetition })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function query(req, res) {
    console.log("PATCH /api/v/competitions/query")

    try {
        const {
            name,
            location,
            date,
            boatType,
            lines,
            lineDistance,
            isCancelled,
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
        if (isActive) filter.isActive = isActive

        const competitions = await Competition.find(filter)

        if (!competitions || competitions.length === 0) {
            res.status(404).send({ msg: "No competitions found" })
        } else {
            res.status(200).send({competitions: competitions})
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error })
        console.error(error)
    }
}

module.exports = {
    getCompetitions,
    getCompetition,
    postCompetition,
    patchCompetition,
    query,
}