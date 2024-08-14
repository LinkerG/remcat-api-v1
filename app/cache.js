const NodeCache = require("node-cache");

// Time to live en minutos
function setupCacheAdapter(ttlMinutes) {
    const cacheAdapter = new NodeCache({
        stdTTL: ttlMinutes * 60,
        checkperiod: 120
    });

    return cacheAdapter
}

module.exports = setupCacheAdapter
