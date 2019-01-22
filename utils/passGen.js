const generator = require('generate-password');

module.exports = (length, numbers, symbols, uppercase, excludeSimilarCharacters, exclude, sctrict) => {
    return generator.generate({
        length,
        numbers,
        symbols,
        uppercase,
        excludeSimilarCharacters,
        exclude,
        sctrict
    });
}