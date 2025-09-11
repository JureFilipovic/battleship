import GameBoard from "./gameboard.js"
import Ship from "./ship.js";

export default function Player(type = "user") {
    const board = GameBoard();
    let enemyBoard;
    let ships = [];

    const getType = () => type;
    const getOwnBoard = () => board;

    const setEnemyBoard = (board) => {
        enemyBoard = board;
    }

    const getEnemyBoard = () => enemyBoard;

    const attack = (row, column) => {
        return enemyBoard.receiveAttack(row, column);
    }

    const randomlyPlaceShips = () => {
        createShips();
        const directions = ["horizontal", "vertical"];
        ships.forEach(ship => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * 10);
                const column = Math.floor(Math.random() * 10);
                const dir = directions[Math.floor(Math.random() * 2)];
                placed = board.placeShip(row, column, ship, dir);
            }
        });
    }

    const createShips = () => {
        const shipLengths = [2, 3, 3, 4, 5];

        for (let i = 0; i < 5; i ++) {
            ships.push(Ship(shipLengths[i]));
        }
    }

    return {
        getType,
        getOwnBoard,
        setEnemyBoard,
        getEnemyBoard,
        attack,
        randomlyPlaceShips,
    }
}