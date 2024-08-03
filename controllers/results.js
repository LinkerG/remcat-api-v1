const Result = require("../models/results")

async function getResultsFromCompetition(req, res) {
    console.log("[GET] /api/v/competitions/:id/results")
    const id = req.params.id
    try {
        const results = await Result.find({ competition_id: [id] })

        if (!results) res.status(400).send({ msg: "Competition not found" })
        else res.status(200).send({ results: results })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function postResult(req, res) {
    console.log("[POST] /api/v/competitions/:id/results")

    const competition_id = req.params.id
    let hasErrors = false
    const insertedResults = []
    try {
        for (data of req.body.results) {
            const result = await insertResult(competition_id, data)
            if (!result) hasErrors = true
            else insertedResults.push(result)
        }

        if (hasErrors) res.status(400).send({ msg: "Results created but with errors", insertedResults: insertedResults })
        else res.status(200).send({ insertedResults: insertedResults })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function insertResult(competition_id, data) {
    const newResult = new Result()

    newResult.competition_id = competition_id
    newResult.teamShortName = data.teamShortName
    newResult.category = data.category
    if (data.time) newResult.time = data.time
    data.isFinal ? newResult.isFinal = data.isFinal : newResult.isFinal = false
    data.isValid ? newResult.isValid = data.isValid : newResult.isValid = true

    const result = await newResult.save()
    if (!result) return false
    else return result
}

async function updateTimes(req, res) {
    console.log("[POST] /api/v/competitions/:id/results/updateTimes")

    const competition_id = req.params.id
    let hasErrors = false
    const updatedResults = []
    try {
        for (data of req.body.results) {
            const team = data.teamShortName
            const category = data.category
            const time = data.time
            const isFinal = data.isFinal

            const result = await Result.findOne({ competition_id: competition_id, teamShortName: team, category: category, isFinal: isFinal })

            if (!result) hasErrors = true
            else {
                result.time = time
                const savedResult = await result.save()
                if (!savedResult) hasErrors = true
                else updatedResults.push(savedResult)
            }
        }

        if (hasErrors) res.status(400).send({ msg: "Results updated but with errors", updatedResults: updatedResults })
        else res.status(200).send({ updatedResults: updatedResults })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function processFinals(req, res) {
    console.log("[POST] /api/v/competitions/:id/results/processFinals")

    const competition_id = req.params.id
    const category = req.body.category
    let hasErrors = false
    const insertedResults = []
    try {
        const results = await Result.find({ competition_id: competition_id, category: category })
        for (result of results) {
            const newResultData = {
                teamShortName: result.teamShortName,
                category: result.category,
                isFinal: true,
            }
            const insertedNewResult = await insertResult(competition_id, newResultData)
            if (!insertedNewResult) hasErrors = true
            else insertedResults.push(insertedNewResult)
        }

        if (hasErrors) res.status(400).send({ msg: "Results updated but with errors", insertedResults: insertedResults })
        else res.status(200).send({ insertedResults: insertedResults })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

module.exports = {
    getResultsFromCompetition,
    postResult,
    updateTimes,
    processFinals,
}
