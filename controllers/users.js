const User = require("../models/users")
const encrypt = require("../utils/encrypt")
const { v4: uuidv4 } = require('uuid')

async function postUser(req, res) {
    console.log("[POST] /api/v/users")

    const newUser = new User()
    const params = req.body

    newUser.name = params.name
    newUser.email = params.email
    newUser.password = await encrypt(params.password)
    newUser.adminLevel = 0;

    try {
        const user = await newUser.save()

        if (!user) res.status(400).send({ msg: "Error creating user" })
        else res.status(200).send({ user: user })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function getApiKeys(req, res) {
    console.log("[GET] /api/v/users/keys")

    try {
        const users = await User.find()

        if (!users) res.status(400).send({ msg: "No users found" })
        else res.status(200).send({ users: users })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

async function generateApiKey(req, res) {
    console.log("[PUT] /api/v/users/:id/keys")

    const id = req.params.id

    try {
        const apiKey = uuidv4()

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { apiKey: apiKey },
            { new: true }
        )

        if (!updatedUser) res.status(404).send('Usuario no encontrado')
        else res.status(200).send({ apiKey: apiKey })
    } catch (error) {
        res.status(500).send(error)
        console.error(error)
    }
}

module.exports = {
    postUser,
    getApiKeys,
    generateApiKey,
}