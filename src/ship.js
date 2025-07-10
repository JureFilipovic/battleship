export default function Ship(length) {
    let hits = 0;

    const getLength = () => length;
    const getHits = () => hits;

    const hit = () => {
        if (hits < length) {
            hits += 1;
            return true;
        }
        return false;
    }

    const isSunk = () => {
        if (hits === length) {
            return true;
        }
        return false;
    }

    return {
        getLength,
        getHits,
        hit,
        isSunk,
    }
}