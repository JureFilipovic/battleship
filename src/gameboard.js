import Ship from "./ship.js";

export default function GameBoard() {
    const board = Array.from({ length: 10 }, () => Array(10).fill(null));
    const ships = [];

    const getBoard = () => board.map(row => [...row]);

    const getShips = () => ships;

    const placeShip = (row, column, ship, direction) => {
        const length = ship.getLength();

        //Check for out of bounds
        if (direction === "horizontal") {
            if (column + length > 10) return false;
        } else {
            if (row + length > 10) return false;
        }
        
        //Check for overlapping ships
        for (let i = 0; i < length; i++) {
            const r = direction === "vertical" ? row + i : row;
            const c = direction === "horizontal" ? column + i : column;
            if (board[r][c] !== null) return false;
        }
        
        //Place the ship
        for (let i = 0; i < length; i++) {
            const r = direction === "vertical" ? row + i : row;
            const c = direction === "horizontal" ? column + i : column;
            board[r][c] = { ship, hit: false };
        }

        if(!ships.includes(ship)) ships.push(ship);
        
        return true;
    }

    const receiveAttack = (row, column) => {
        //Empty cell, missed attack, return true
        if (!board[row][column]) {
            board[row][column] = "Miss";
            return true;
        } else {
            //Tried attack on already attacked cell, return false
            if (board[row][column] === "Miss" || board[row][column].hit === true) {
                return false;
            }

            //Successful attack, return true
            const ship = board[row][column].ship;
            board[row][column].hit = true;
            ship.hit();
            return true;
        }
    }

    const allShipsSunk = () => ships.every(ship => ship.isSunk());

    return {
        getBoard,
        getShips,
        placeShip,
        receiveAttack,
        allShipsSunk,
    }
}

