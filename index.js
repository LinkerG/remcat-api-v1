const api = require("./api")
require('dotenv').config()
const mongoose = require("mongoose")
const port = process.env.PORT || 3333

console.log("[RemCat] starting server")

const urlMongoAtlas = process.env.MONGO_URI
console.log("[RemCat] connecting to remote database")

mongoose.connect(urlMongoAtlas)

mongoose.connection.on('error', (err) => {
    console.error('[RemCat] MongoDB connection error:', err)
})

mongoose.connection.once('open', async () => {
    console.log("[RemCat] MongoDB connection successful")

    api.listen(port, () => {
        console.log("[RemCat] listening on port:", port)
    })
})