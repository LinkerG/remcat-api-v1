// Model
const Team = require("../models/teams")
const Competition = require("../models/competitions")
const Result = require("../models/results")
// Model functions
const { getYears } = require("./competitions")
const { getLeagueData } = require("./league")
// Cache
const { setupCacheAdapter, handleCache } = require("../app/cache")
const cacheAdapter = setupCacheAdapter(15)
// Utils
const getTeamImages = require("../utils/getTeamImages")
const sortResults = require("../utils/sortResults")

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

async function getTeamResume(req, res) {
    console.log("[GET] /api/v/teams/:name/resume");

    const teamName = req.params.name;

    try {
        const competitions = await Competition.find({ isActive: true, isCancelled: false });
        const results = await Result.find({ isValid: true /*isFinal: true*/ });

        if (!competitions || !results) {
            return res.status(404).send({ error: "Missing Data" });
        }

        let teamResume = [];

        const championships = competitions.filter(competition => competition.isChampionship);

        championships.forEach(competition => {
            const year = competition.date.getFullYear();
            let yearResume = teamResume.find(yearRes => yearRes.year === year);

            const resultsForThisCompetition = results.filter(result => result.competition_id == competition._id);
            const resultsByCategory = resultsForThisCompetition.reduce((acc, result) => {
                if (!acc[result.category]) acc[result.category] = [];
                acc[result.category].push(result);
                return acc;
            }, {});

            let competitionResults = [];

            Object.entries(resultsByCategory).forEach(([category, categoryResults]) => {
                const sortedResults = sortResults(categoryResults);
                const position = sortedResults.findIndex((result) => result.teamShortName === teamName) + 1;
                const result = sortedResults.find(res => res.teamShortName === teamName);

                if (result) {
                    competitionResults.push({
                        "competition_name": competition.name,
                        "category": result.category,
                        "position": position
                    });
                }
            });

            if (!yearResume) {
                teamResume.push({
                    "year": year,
                    "results": competitionResults,
                });
            } else {
                yearResume.results.push(...competitionResults);
            }
        });

        const years = await getYears();
        for (const yearObject of years) {
            const year = yearObject.year;
            const leagues = await getLeagueData(year);

            let competitionResults = [];
            leagues.forEach((league) => {
                const sortedResults = league.teamSummary.sort((a, b) => b.points - a.points);
                const position = sortedResults.findIndex((result) => result.teamName === teamName) + 1;

                competitionResults.push({
                    "competition_name": league.boatType,
                    "category": league.category,
                    "position": position
                });
            });

            let yearResume = teamResume.find(yearRes => yearRes.year === year);

            if (!yearResume) {
                teamResume.push({
                    "year": year,
                    "results": competitionResults,
                });
            } else {
                yearResume.results.push(...competitionResults);
            }
        }

        console.log(teamResume);

        res.status(200).send({ resume: teamResume });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
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
    getTeamResume,
    postTeams,
    patchTeam,
}
