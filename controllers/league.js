const Competition = require("../models/competitions")
const Result = require("../models/results")
const sortResults = require("../utils/sortResults")

async function getLeagueBySeason(req, res) {
    console.log("[GET] /api/v/league/:season");
    const season = req.params.season;
    const startYearInt = parseInt(season, 10);

    const startDate = new Date(`${startYearInt}-01-01`);
    const endDate = new Date(`${startYearInt}-12-31`);

    try {
        const competitions = await Competition.find({
            date: {
                $gte: startDate,
                $lte: endDate
            },
            isLeague: true,
        })

        const competitionIds = competitions.map(competition => competition._id)

        const results = await Result.find({
            competition_id: { $in: competitionIds },
            isValid: true,
            //isFinal: true,
        })

        const leagues = []

        competitions.forEach((competition) => {
            const boatType = competition.boatType;
            const resultsForThisCompetition = results.filter(result => result.competition_id == competition._id);

            const resultsByCategory = {};
            resultsForThisCompetition.forEach((result) => {
                const category = result.category;
                if (!resultsByCategory[category]) {
                    resultsByCategory[category] = [];
                }
                resultsByCategory[category].push(result);
            });

            console.log(competition.name);


            Object.keys(resultsByCategory).forEach((category) => {
                const sortedResults = sortResults(resultsByCategory[category])
                let points = 20;
                console.log(category);

                sortedResults.forEach((result) => {
                    const teamName = result.teamShortName;
                    console.log(teamName)
                    console.log(points)

                    const league = leagues.find(league => league.boatType === boatType && league.category === category);

                    if (league) {
                        // Si se encontró la liga, busca si ya existe el equipo dentro del teamResume
                        const existingTeam = league.teamResume.find(team => team.teamName === teamName);
                        // Si el equipo no existe, lo agrega al teamResume
                        if (!existingTeam) {
                            league.teamResume.push({ "teamName": teamName, "points": points });
                        } else {
                            existingTeam.points += points;
                        }
                    } else {
                        // Si no se encontró la liga, crea una nueva y agrega el equipo
                        leagues.push({
                            "boatType": boatType,
                            "category": category,
                            "teamResume": [{ "teamName": teamName, "points": points }]
                        });
                    }
                    points = points === 0 ? 0 : points -= 1
                })
            });
        });

        res.status(200).send({ leagues: leagues })

    } catch (error) {
        res.status(500).send(error);
        console.error(error);
    }
}

module.exports = {
    getLeagueBySeason,
}
