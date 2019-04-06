const router = require('express').Router();
const P = require('./setup');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', async (req, res) => {
    const pokemonName = req.body.pokemon.trim().toLowerCase();

    try {
        const info = await P.getPokemonByName(pokemonName);
        const moves = info.moves;
        res.render('index', {
            pokemonName,
            moves
        });
    } catch(err) {
        res.render('index', {
            err: "No such Pokemon."
        })
    }
});

router.get('/move/:move', async (req, res) => {
    const moveName = req.params.move;

    try {
        const info = await P.getMoveByName(moveName);
        const effect = info.effect_entries[0].effect;
        res.render('index', {
            moveName,
            effect
        });
    } catch(err) {
        res.render('index', {
            err: "No such Pokemon."
        })
    }
});

router.get('/style.css', (req, res) => {
    res.sendFile(__dirname + "/views/style.css");
});
module.exports = router;