const path = require('path');
const util = require('util');

async function uploadFile(requestFile, fileName, targetDirectory) {
    if (requestFile) {
        const file = fileName + path.extname(requestFile.name);
        const uploadPath = path.join(__dirname, targetDirectory, file);

        const mvAsync = util.promisify(requestFile.mv);

        try {
            await mvAsync(uploadPath);
            return file;
        } catch (err) {
            console.error("Error subiendo archivo:", err);
            return "default.png";
        }

    } else {
        return "default.png";
    }
}

module.exports = uploadFile;
