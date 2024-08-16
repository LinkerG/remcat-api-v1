const path = require('path');
const fs = require('fs').promises;

async function getTeamImages(teams) {
    const teamsWithImages = await Promise.all(teams.map(async (team) => {
        let imageData = null;

        if (team.image) {
            const imagePath = path.join(__dirname, '../uploads/teams', team.image);

            try {
                // Lee la imagen como un buffer
                const imageBuffer = await fs.readFile(imagePath);

                // Codifica la imagen en base64
                imageData = imageBuffer.toString('base64');
            } catch (err) {
                console.error(`Error al leer la imagen ${team.image}:`, err);
                imageData = null; // Si no se puede leer la imagen, establece null
            }
        }

        return {
            name: team.name,
            shortName: team.shortName,
            image: imageData,
            isActive: team.isActive
        };
    }));

    return teamsWithImages;
}

module.exports = getTeamImages;