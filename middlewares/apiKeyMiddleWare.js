const mongoose = require('mongoose');
const User = require('../models/users'); // Asegúrate de que la ruta sea correcta

const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.header('api_key');
    if (!apiKey) {
        return res.status(401).send('Unauthorized: API Key is required');
    }

    try {
        // Buscar al usuario con la apiKey proporcionada y que esté activo
        const user = await User.findOne({ apiKey, isActive: true });

        if (!user) {
            return res.status(401).send('Unauthorized: Invalid or inactive API Key');
        }

        // Si se encuentra un usuario válido, continuar
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = apiKeyMiddleware;
