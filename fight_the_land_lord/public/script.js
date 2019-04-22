import validatePoker from './validatePoker.js';
import compareValue from './compareValue.js';

const socket = io();

const $message = document.querySelector("#playground #message");
const $playerList = document.querySelector("#player-list");

const $turnInfo = document.querySelector("#player-info #turnInfo");

let playerInfo = {};

socket.on("send message", (msg) => {
    $message.innerHTML += `<p>${msg}<p>`;
});

socket.on("game start", ({msg, allPlayerNames, landlordInd}) => {
    $message.innerHTML += `<p>${msg}<p>`;
    socket.emit("game setup");
    $playerList.innerHTML = `<h1>Player List</h1><ul><li>${allPlayerNames[0]}</li><li>${allPlayerNames[1]}</li><li>${allPlayerNames[2]}</li></ul>`;
    const $players = document.querySelectorAll("#player-list ul li");
    $players[landlordInd].classList.add("landlord");
});

socket.on("game setup finished", ({name, isLandLord, cards, index}) => {
    playerInfo.isLandLord = false;
    playerInfo.name = name;
    playerInfo.index = index;

    const $players = document.querySelectorAll("#player-list ul li");
    $players[index].classList.add("player");

    document.querySelector("#player-info #name").innerHTML = `Player ${name}`;
    if (isLandLord) {
        document.querySelector("#player-info #landlord").innerHTML = "You are the landlord.";
    } else {
        document.querySelector("#player-info #landlord").innerHTML = "You are the farmer.";
    }

    let cardHTML = '';

    for (let i = 0; i < cards.length; i++) {
        let cardContent = cards[i];
        switch(cards[i]) {
            case 1:
                cardContent = 'A';
                break;
            case 11:
                cardContent = 'J';
                break;
            case 12:
                cardContent = 'Q';
                break;
            case 13:
                cardContent = 'K';
                break;
            case 14:
                cardContent = 'S-Jok';
                break;
            case 15:
                cardContent = 'L-Jok';
                break;
        }
        cardHTML += `<div class="card ${cards[i]}" id="${i}">${cardContent}</div>`;
    }


    document.querySelector("#player-info #play-cards #cards").innerHTML = cardHTML;
    document.querySelector("#player-info #play-cards #buttons").innerHTML = '<button id="skip">Skip</button><button id="confirm">Confirm</button>';


    //the landlord can play cards first
    if (isLandLord) {
        //it's your turn prompt
        const text = "It's your turn."
        $turnInfo.innerHTML = text;
        //setup event listener
        const $cards = document.querySelectorAll("#player-info .card");
        const $skip = document.querySelector("#player-info #skip");
        const $confirm = document.querySelector("#player-info #confirm");

        const cardsToPlay = [];

        for (let j = 0; j < cards.length; j++) {
            $cards[j].addEventListener('click', (e) => {
                const id = e.target.id;
                const indexInCardToPlay = cardsToPlay.findIndex(card => id === card.id);
                if(indexInCardToPlay >= 0) {
                    cardsToPlay.splice(indexInCardToPlay, 1);
                    $cards[j].classList.remove("toPlay");
                } else {
                    cardsToPlay.push({
                        id,
                        value: e.target.classList[1]
                    });
                    e.target.classList.add("toPlay");
                }
            })
        }

        $confirm.addEventListener('click', () => {
            //validate
            const cardType = validatePoker(cardsToPlay);
            if(cardType) {
                socket.emit("play cards", {cardsToPlay, cardType, playerIndex: playerInfo.index, skipped: [false]});
            }
        });

        $skip.addEventListener('click', () => {
            alert("You cannot skip!");
        })
    } else {
        //it's your turn prompt
        const text = "It's landlord's turn.";
        $turnInfo.innerHTML = text;
    }

});

socket.on("update card", (cards) => {
    let cardHTML = '';

    for (let i = 0; i < cards.length; i++) {
        let cardContent = cards[i];
        switch(cards[i]) {
            case 1:
                cardContent = 'A';
                break;
            case 11:
                cardContent = 'J';
                break;
            case 12:
                cardContent = 'Q';
                break;
            case 13:
                cardContent = 'K';
                break;
            case 14:
                cardContent = 'S-Jok';
                break;
            case 15:
                cardContent = 'L-Jok';
                break;
        }
        cardHTML += `<div class="card ${cards[i]}" id="${i}">${cardContent}</div>`;
    }

    document.querySelector("#player-info #cards").innerHTML = cardHTML + '<div><button id="skip">Skip</button><button id="confirm">confirm</button></div>';
});

socket.on("next turn", ({cardsPlayed, cardType, nextPlayerIndex, skipped}) => {
    //display cards played
    let cardHTML = "";
    if (skipped[skipped.length - 1]) {
        cardHTML = '<p id="skip">Skip</p>';
    } else {
        for (let i = 0; i < cardsPlayed.length; i++) {
            let cardContent = cardsPlayed[i].value;
            switch(parseInt(cardsPlayed[i].value)) {
                case 1:
                    cardContent = 'A';
                    break;
                case 11:
                    cardContent = 'J';
                    break;
                case 12:
                    cardContent = 'Q';
                    break;
                case 13:
                    cardContent = 'K';
                    break;
                case 14:
                    cardContent = 'S-Jok';
                    break;
                case 15:
                    cardContent = 'L-Jok';
                    break;
            }
            cardHTML += `<div class="card ${cards[i]}" id="${i}">${cardContent}</div>`;
        }
    }

    document.querySelector("#playground #card-display").innerHTML = cardHTML;

    //setup this player's turn
    if (parseInt(playerInfo.index) === parseInt(nextPlayerIndex)) {
        const text = "It's your turn.";
        $turnInfo.innerHTML = text;

        //setup event listener

        const $cards = document.querySelectorAll("#player-info .card");
        const $skip = document.querySelector("#player-info #skip");
        const $confirm = document.querySelector("#player-info #confirm");

        let cardsToPlay = [];

        for (let j = 0; j < $cards.length; j++) {
            $cards[j].addEventListener('click', (e) => {
                const id = e.target.id;
                const indexInCardToPlay = cardsToPlay.findIndex(card => id === card.id);
                if(indexInCardToPlay >= 0) {
                    cardsToPlay.splice(indexInCardToPlay, 1);
                    $cards[j].classList.remove("toPlay");
                } else {
                    cardsToPlay.push({
                        id,
                        value: e.target.classList[1]
                    });
                    e.target.classList.add("toPlay");
                }
            })
        }

        $confirm.addEventListener('click', () => {
            //validate
            const thisCardType = validatePoker(cardsToPlay);
            if (thisCardType) {
                if (skipped.length === 0) {
                    skipped.push(false);
                    socket.emit("play cards", {cardsToPlay, cardType: thisCardType, playerIndex: playerInfo.index, skipped});
                } else {
                    if(cardType === thisCardType) {
                        //compare the value
                        if(compareValue(cardType, cardsPlayed, cardsToPlay)){
                            skipped.push(false);
                            socket.emit("play cards", {cardsToPlay, cardType: thisCardType, playerIndex: playerInfo.index, skipped});
                        }
                    }
                }
            }
        });

        $skip.addEventListener('click', () => {
            if (skipped.length === 0) {
                return alert("You cannot skip");
            }

            cardsToPlay = [];
            skipped.push(true);
            socket.emit("play cards", {cardsToPlay, cardType, playerIndex: playerInfo.index, skipped});
        });
    } else {
        //display other player's turn information
        const allPlayers = document.querySelectorAll("#player-list li");
        const playerName = allPlayers[nextPlayerIndex].innerHTML;
        const text = `It's ${playerName}'s turn.`;
        $turnInfo.innerHTML = text;
    }
});

socket.on("Game Finished", (winnerIndex, isLandLord) => {
    const $players = document.querySelectorAll("#player-list ul li");
    const winnerName = $players[winnerIndex].innerHTML;
    if (isLandLord) {
        alert(`${winnerName} has played all cards. The landlord wins.`);
    } else {
        alert(`${winnerName} has played all cards. The farmers win.`);
    }
});