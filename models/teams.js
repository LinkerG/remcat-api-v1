const mongoose = require("mongoose")
var Schema = mongoose.Schema

const teamSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
})

module.exports = mongoose.model("Team", teamSchema)
