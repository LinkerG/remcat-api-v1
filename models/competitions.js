const mongoose = require("mongoose")
var Schema = mongoose.Schema

const competitionSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    boatType: {
        type: String,
        required: true,
    },
    lines: {
        type: Number,
        required: true,
    },
    lineDistance: {
        type: Number,
        required: true,
    },
    isCancelled: {
        type: Boolean,
        required: true,
        default: false
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
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
})

module.exports = mongoose.model("Competition", competitionSchema)
