const Pokedex = require('pokedex-promise-v2');

const options = {
    protocol: 'https',
    hostName: 'pokeapi.co',
    versionPath: '/api/v2/',
    cacheLimit: 100 * 1000, // 100s
    timeout: 5 * 1000 // 5s
};

const P = new Pokedex(options);

module.exports = P;