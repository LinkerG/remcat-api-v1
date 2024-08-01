async function getTest(req,res){
    res.status(200).send("Hola mundo! Desde GET")
    console.log("GET /api/v/test")
}

async function postTest(req,res){
    res.status(200).send("Hola mundo! Desde POST")
    console.log("POST /api/v/test")
}

module.exports = {
    getTest,
    postTest,
}