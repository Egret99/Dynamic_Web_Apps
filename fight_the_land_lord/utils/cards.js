const shuffle = require('shuffle-array');

const playedCards = [];

const createNewSet = () => {
    const allCards = [];
    for (let i = 1; i < 14; i++) {
        allCards.push(...[i,i,i,i]);
    }

    allCards.push(...[14, 15]);
    
    shuffle(allCards);

    return allCards;
}

const spread = (cards) => {
    const player1Set = cards.filter((card, index) => index < 17).sort((a, b) => a - b);
    const player2Set = cards.filter((card, index) => 17 <= index && index < 34).sort((a, b) => a - b);
    const player3Set = cards.filter((card, index) => 34 <= index && index < 51).sort((a, b) => a - b);
    const baseSet = cards.filter((card, index) => 51 <= index).sort((a, b) => a - b);

    // console.log(`player1: ${player1Set}
    // player2: ${player2Set}
    // player3: ${player3Set}
    // base: ${baseSet}`);

    return [
        player1Set,
        player2Set,
        player3Set,
        baseSet
    ];
}

const addPlayedCards = (cards) => {
    playedCards.push(...cards);
}

const getAllPlayedCards = () => playedCards;

module.exports = {
    createNewSet,
    spread,
    addPlayedCards,
    getAllPlayedCards
}