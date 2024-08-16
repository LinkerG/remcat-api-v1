// Model
const Team = require("../models/teams")
// Cache
const { setupCacheAdapter, handleCache } = require("../app/cache")
const cacheAdapter = setupCacheAdapter(15)
// Utils
const getTeamImages = require("../utils/getTeamImages")

async function getTeams(req, res) {
    console.log("[GET] /api/v/teams");

    const onlyActives = req.query.onlyActives === 'true';
    const cacheKey = `teams-${onlyActives}`;
    res.set('Cache-Control', 'public, max-age=1800') // 30 minutos

    try {
        const teams = await handleCache(cacheAdapter, cacheKey, () => getData());

        if (!teams || teams.length === 0) {
            res.status(404).send({ msg: "No teams found" });
        } else {
            const teamsWithImages = await getTeamImages(teams);
            res.status(200).send({ teams: teamsWithImages });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error", error });
    }

    async function getData() {
        let filter = {};
        if (onlyActives) {
            filter.isActive = true;
        }

        return await Team.find(filter).sort({ created_at: -1 });
    }
}

async function getTeam(req, res) {
    console.log("[GET] /api/v/teams/:name");

    const shortName = req.params.name;
    const cacheKey = `team-${shortName}`;
    res.set('Cache-Control', 'public, max-age=1800') // 30 minutos

    try {
        const team = await handleCache(cacheAdapter, cacheKey, () => getData());

        if (!team) {
            res.status(404).send({ msg: "Team not found" });
        } else {
            const teamWithImage = await getTeamImages([team]);
            res.status(200).send({ team: teamWithImage[0] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }

    async function getData() {
        return await Team.findOne({ shortName });
    }
}

async function postTeams(req, res) {
    console.log("[POST] /api/v/teams");

    const newTeam = new Team();
    const params = req.body;


    newTeam.name = params.name;
    newTeam.shortName = params.shortName;

    const imageName = req.files[0].filename

    newTeam.image = imageName

    try {
        const team = await newTeam.save();

        if (!team) {
            res.status(400).send({ msg: "Error creando el equipo" });
        } else {
            res.status(200).send({ team: team });
        }
    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
}

async function patchTeam(req, res) {
    console.log("[PATCH] /api/v/teams/:id")

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
