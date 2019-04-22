const validatePoker = (cards) => {
    const len = cards.length;
    let cardType;

    switch(len) {
        case 1:
            cardType = "one";
            break;
        case 2:
            if(cards[0].value !== cards[1].value) {
                alert("A double-cards must be the same!");
                break;
            } else {
                cardType = "double";
            }

            break;
        case 3:
            if(cards[0].value !== cards[1].value || cards[0].value !== cards[2].value) {
                alert("A tripple-cards must all be the same!");
                break;
            } else {
                cardType = "tripple"
            }

            break;
        
        case 4: 
            cardType = "other";
            break;
        
        // default:
        //     let [card1, card2, card3, card4, card5] = cards;
    }

    return cardType;
}

export default validatePoker;