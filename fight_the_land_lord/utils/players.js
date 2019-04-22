const players = [];

const addPlayer = ({id, name}) => {
    const newPlayer = {
        id,
        name,
        isLandLord: false,
        cards: []
    };

    players.push(newPlayer);

    return newPlayer;
}

const removePlayer = (id) => {
    const ind = players.findIndex( player => player.id === id);
    const removedPlayer = players.splice(ind, 1);

    return removedPlayer;
}

const findPlayer = (id) => {
    const player = players.find( player => player.id === id);

    return player;
}

const findPlayerIndex = id => players.findIndex( player => player.id === id);

const getAllPlayer = () => {
    return players;
}

const updatePlayerData = (index, key, value) => {
    players[index][key] = value;
    return players[index];
}

const findLandLord = () => players.findIndex(player => player.isLandLord);

module.exports = {
    players,
    addPlayer,
    removePlayer,
    findPlayer,
    getAllPlayer,
    updatePlayerData,
    findLandLord,
    findPlayerIndex
};