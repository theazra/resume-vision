const pdf = require('pdf-parse');

module.exports = async function parsePdf(buffer) {
    return await pdf(buffer);
};
