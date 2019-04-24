const compareValue = (type, prevCard, thisCard) => {
    if (["one", "double", "tripple", ].includes(type)) {
        if (prevCard[0].value < thisCard[0].value) {
            return true;
        }
    } else if (type === "rocket") {
        return true;
    }

    return false;
}

export default compareValue;