const api = require("./app/api")
const mongoose = require("mongoose")
require('dotenv').config()
const urlMongoAtlas = process.env.MONGO_URI
const port = process.env.PORT || 3333

console.log("[RemCat] Starting server")

console.log("[RemCat] Connecting to remote database")
mongoose.connect(urlMongoAtlas)

mongoose.connection.on('error', (err) => {
    console.error('[RemCat] MongoDB connection error:', err)
})

mongoose.connection.once('open', async () => {
    console.log("[RemCat] MongoDB connection successful")

    api.listen(port, () => {
        console.log("[RemCat] Listening on port:", port)
    })
})
