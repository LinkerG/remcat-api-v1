function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fakeTime(minMinutes, maxMinutes) {
    const minutes = getRandomInt(minMinutes, maxMinutes).toString().padStart(2, '0');
    const seconds = getRandomInt(0, 59).toString().padStart(2, '0');
    const milliseconds = getRandomInt(0, 999).toString().padStart(3, '0');

    return `${minutes}:${seconds}:${milliseconds}`;
}

module.exports = fakeTime
