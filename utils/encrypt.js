const bcrypt = require('bcrypt')
const saltRounds = 10

async function encrypt(data) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(data, salt);

    return hashedPassword;
}

module.exports = encrypt