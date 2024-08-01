const mongoose = require("mongoose")
var Schema = mongoose.Schema

const resultSchema = Schema({
    competition_id: {
        type: String,
        required: true,
    },
    teamShortName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
        default: "DNS",
    },
    isFinal: {
        type: Boolean,
        required: true,
        default: false,
    },
    isLeague: {
        type: Boolean,
        required: true,
        default: false,
    },
    isChampionship: {
        type: Boolean,
        required: true,
        default: false,
    },
    isValid: {
        type: Boolean,
        required: true,
        default: true,
    },
})

module.exports = mongoose.model("Results", resultSchema)