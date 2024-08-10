const stringToSlug = require("../../utils/stringToSlug")

const competitions = [
    {
        name: '1a Regata de Lliga Llaüt Mediterrani',
        slug: stringToSlug('1a Regata de Lliga Llaüt Mediterrani'),
        location: 'Badalona',
        date: new Date('2024-08-11'),
        boatType: 'llaut',
        lines: 4,
        lineDistance: 350,
        isCancelled: false,
        isLeague: true,
        isChampionship: false,
        isActive: true
    },
    {
        name: '2a Regata de Lliga Llaüt Mediterrani',
        slug: stringToSlug('2a Regata de Lliga Llaüt Mediterrani'),
        location: 'Castelldefells',
        date: new Date('2024-08-18'),
        boatType: 'llaut',
        lines: 3,
        lineDistance: 350,
        isCancelled: false,
        isLeague: true,
        isChampionship: false,
        isActive: true
    },
    {
        name: '3a Regata de Lliga Llaüt Mediterrani',
        slug: stringToSlug('3a Regata de Lliga Llaüt Mediterrani'),
        location: 'Tarragona',
        date: new Date('2024-08-25'),
        boatType: 'llaut',
        lines: 4,
        lineDistance: 350,
        isCancelled: false,
        isLeague: true,
        isChampionship: false,
        isActive: true
    },
    {
        name: 'Campionat de Catalunya de Batel',
        slug: stringToSlug('Campionat de Catalunya de Batel'),
        location: 'Castelldefells',
        date: new Date('2024-08-24'),
        boatType: 'batel',
        lines: 4,
        lineDistance: 500,
        isCancelled: false,
        isLeague: false,
        isChampionship: true,
        isActive: true
    },
    {
        name: 'Campionat de Catalunya de Llagut català',
        slug: stringToSlug('Campionat de Catalunya de Llagut català'),
        location: 'Deltebre',
        date: new Date('2024-09-08'),
        boatType: 'llagut',
        lines: 4,
        lineDistance: 350,
        isCancelled: false,
        isLeague: false,
        isChampionship: true,
        isActive: true
    }
]

module.exports = competitions
