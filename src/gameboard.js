import Ship from "./ship.js";

export default function GameBoard() {
    const board = Array.from({ length: 10 }, () => Array(10).fill(null));
    const ships = [];

    const getBoard = () => board.map(row => [...row]);

    const getShips = () => ships;

    const placeShip = (row, column, ship, direction) => {
        const length = ship.getLength();

        // Out-of-bounds check
        if (direction === "horizontal") {
            if (column + length > 10) return false;
        } else {
            if (row + length > 10) return false;
        }

        // Helper: is a board cell (and its 8 neighbors) free?
        const isAreaFree = (r, c) => {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (
                        nr >= 0 && nr < 10 &&
                        nc >= 0 && nc < 10 &&
                        board[nr][nc] !== null
                    ) {
                        return false; // neighbor occupied
                    }
                }
            }
            return true;
        };

        // Check every intended cell and its surrounding neighbors
        for (let i = 0; i < length; i++) {
            const r = direction === "vertical" ? row + i : row;
            const c = direction === "horizontal" ? column + i : column;
            if (!isAreaFree(r, c)) return false;
        }

        // Place the ship
        for (let i = 0; i < length; i++) {
            const r = direction === "vertical" ? row + i : row;
            const c = direction === "horizontal" ? column + i : column;
            board[r][c] = { ship, hit: false };
        }

        if (!ships.includes(ship)) ships.push(ship);

        return true;
    }

    const receiveAttack = (row, column) => {
        //Empty cell, missed attack, return true
        if (!board[row][column]) {
            board[row][column] = "Miss";
            return "miss";
        } else {
            //Tried attack on already attacked cell, return false
            if (board[row][column] === "Miss" || board[row][column].hit === true) {
                return "Already attacked";
            }

            //Successful attack, return true
            const ship = board[row][column].ship;
            board[row][column].hit = true;
            ship.hit();
            return "hit";
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

