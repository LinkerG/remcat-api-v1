const Team = require("../models/teams")

async function getTeams(req, res) {
    console.log("GET /api/v/teams")

    const onlyActives = req.query.onlyActives === 'true'

    try {
        let filter = {}
        if (onlyActives) {
            filter.isActive = true
        }

        const teams = await Team.find(filter).sort({ created_at: -1 })
        
        if (!teams || teams.length === 0) {
            res.status(400).send({ msg: "No teams found" })
        } else {
            res.status(200).send({teams: teams})
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal server error", error })
        console.error(error)
    }
}


async function getTeam(req,res){
    console.log("GET /api/v/teams/:name")
    const shortName = req.params.name
    try {
        const team = await Team.findOne({shortName: [shortName]})
        
        if(!team) res.status(400).send({msg:"Team not found"})
        else res.status(200).send({team: team})
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function postTeams(req, res) {
    console.log("POST /api/v/teams")

    const newTeam = new Team()
    const params = req.body

    newTeam.name = params.name
    newTeam.shortName = params.shortName
    params.image != "" ? newTeam.image = params.image : "default.png"

    try {
        const team = await newTeam.save()

        if (!team) res.status(400).send({ msg: "Error creating team" })
        else res.status(200).send({ team: team })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function patchTeam(req, res) {
    console.log("PATCH /api/v/teams/:id")

    const id = req.params.id
    
    try {
        const team = await Team.findByIdAndUpdate(id, req.body)
        const newTeam = await Team.findById(id)
        if (!team) res.status(400).send({ msg: "Error updating team" })
        else res.status(200).send({ old: team, new: newTeam })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

module.exports = {
    getTeams,
    getTeam,
    postTeams,
    patchTeam,
}