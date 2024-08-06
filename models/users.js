const mongoose = require("mongoose")
var Schema = mongoose.Schema

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    apiKey: {
        type: String,
        required: false,
        default: "",
    },
    adminLevel: {
        type: Number,
        required: true,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    }
})

module.exports = mongoose.model("User", userSchema)