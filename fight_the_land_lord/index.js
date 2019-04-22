const http = require('http');
const express = require('express');
const socket = require('socket.io');

const randomstring = require('randomstring');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const {createNewSet, spread, addPlayedCards, getAllPlayedCards} = require('./utils/cards');
const {addPlayer, removePlayer, findPlayer, getAllPlayer, updatePlayerData, findPlayerIndex} = require('./utils/players');
app.use(express.static(__dirname + '/public'));

//set a random player as the landlord
let landlordInd;

//track player
let playerNum = 0;
io.on('connection', (socket) => {
    console.log("New Connection");
    if(playerNum >= 3) {
        //the player cannot join the game
        socket.emit("send message", "The room is full.");

    } else {
        //player join the game
        socket.emit("send message", "Welcome to the room.");
        socket.broadcast.emit("send message", "Another player joined the room.");
        playerNum++;
        addPlayer({id:socket.id, name: randomstring.generate(5)});

        if(playerNum === 3) {
            const allCards = createNewSet();
            const cardSets = spread(allCards);

            //setup a random player to landlord
            landlordInd = Math.floor(Math.random() * 3)

            //update player info with landlord and cards
            for (let i = 0; i < 3; i++) {
                updatePlayerData(i, "cards", cardSets[i]);

                if(i === landlordInd) {
                    updatePlayerData(i, "isLandLord", true);
                    updatePlayerData(i, "cards", [...cardSets[i], ...cardSets[3]].sort((a, b) => a - b));
                }
            }

            io.emit("game start", {
                msg: "Game Start",
                allPlayerNames: getAllPlayer().map(player => player.name),
                landlordInd
            });
        }
    }

    socket.on('game setup', () => {
        const playerInfo = {...findPlayer(socket.id), index: findPlayerIndex(socket.id)};
        socket.emit('game setup finished', playerInfo);
    });

    socket.on('disconnect', () => {
        if(findPlayer(socket.id)) {
            removePlayer(socket.id);
            playerNum--;
            io.emit("send message", "A player left");
        }
    });

    socket.on("play cards", ({cardsToPlay, cardType, playerIndex, skipped}) => {
        addPlayedCards(cardsToPlay);

        const leftCards = getAllPlayer()[playerIndex].cards.map(card => card);

        for(let i = 0; i < cardsToPlay.length; i++) {
            leftCards.splice(leftCards.indexOf(parseInt(cardsToPlay[i].value)), 1);
        }

        updatePlayerData(playerIndex, "cards", leftCards);
        socket.emit("update card", getAllPlayer()[playerIndex].cards);

        if (leftCards.length === 0) {
            return io.emit("Game Finished", playerIndex, getAllPlayer()[playerIndex].isLandlord);
        }

        let nextPlayerIndex = playerIndex;

        const lastSkipIndex = skipped.length - 1;

        if (skipped[lastSkipIndex] && skipped[lastSkipIndex - 1]) {
            console.log("new round");
            cardsPlayed = [];
            skipped = [];
            cardType = "";
        }

        nextPlayerIndex = (playerIndex + 1) % 3;

        io.emit("next turn", {cardsPlayed: cardsToPlay, cardType, nextPlayerIndex, skipped});
    })
});

server.listen(3000, () => {
    console.log("App running on 3000.");
});