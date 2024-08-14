const NodeCache = require("node-cache");

// Time to live en minutos
function setupCacheAdapter(ttlMinutes) {
    const cacheAdapter = new NodeCache({
        stdTTL: ttlMinutes * 60,
        checkperiod: 120
    });

    return cacheAdapter
}

async function handleCache(cacheAdapter, key, fetchFunction) {
    // Intentar obtener datos desde la caché
    const cachedData = await cacheAdapter.get(key);
    if (cachedData) {
        console.log("Cached ✅");
        return cachedData;
    }

    // Si no hay datos en la caché, obtenerlos a través de la función de consulta
    const freshData = await fetchFunction();
    // Almacenar los datos frescos en la caché
    await cacheAdapter.set(key, freshData);
    return freshData;
}

module.exports = { setupCacheAdapter, handleCache }
