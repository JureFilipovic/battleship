import Player from "./player.js";
import domController from "./domController.js";

export default function gameController() {
    const player1 = Player("user");
    const player2 = Player("computer");
    const dom = domController();
    let currentPlayer = player1;
    let computerHits = [];
    let candidateQueue = [];
    let computerBoardVisible = false;

    const toggleComputerBoardVisible = () => {
        computerBoardVisible = !computerBoardVisible;
        dom.renderBoard(
            player2.getOwnBoard().getBoard(), 
            ".enemy-board", 
            computerBoardVisible
        );
        dom.bindCellClicks(".enemy-board", handlePlayerMove);
    };

    const init = () => {
        player2.randomlyPlaceShips();
        player2.setEnemyBoard(player1.getOwnBoard());

        player1.createShips();
        dom.renderBoard(player1.getOwnBoard().getBoard(), ".player-board", true);
        dom.renderShipyard(player1.getShips());

        dom.onAllShipsPlaced = () => {
            startBattlePhase();
        };
    };

    const startBattlePhase = () => {
        player1.setEnemyBoard(player2.getOwnBoard());

        dom.renderBoard(player2.getOwnBoard().getBoard(), ".enemy-board", computerBoardVisible);
        dom.bindCellClicks(".enemy-board", handlePlayerMove);
        dom.bindToggleComputerBoard(toggleComputerBoardVisible); 
    };

    const placePlayerShip = (ship, row, col, direction) => {
        return player1.getOwnBoard().placeShip(row, col, ship, direction);
    }

    const handlePlayerMove = (row, col) => {
        if (currentPlayer !== player1) return;

        const result = player1.attack(row, col);
        if (result === "Already attacked") {
            return;
        }
        dom.updateCell(".enemy-board", row, col, result);

        if (player2.getOwnBoard().allShipsSunk()) {
            alert("You win!");
            document.querySelectorAll(".cell").forEach(cell => cell.classList.add("disabled"));
            return;
        }

        currentPlayer = player2;
        playComputerTurn();
    };

    const determineCandidates = (row, col) => {
        const enemyBoard = player2.getEnemyBoard().getBoard();
        const neighbors = [
            [row, col - 1], 
            [row, col + 1],
            [row - 1, col],
            [row + 1, col]
        ];

        const inBounds = (r, c) => r >= 0 && r < 10 && c >= 0 && c < 10;
        
        const addCandidate = (r, c) => {
            if (!inBounds(r, c)) return;

            const cell = enemyBoard[r][c];
            const notAttacked = cell === null || (cell.ship && cell.hit === false);

            if (notAttacked &&
                !candidateQueue.some(([qr, qc]) => qr === r && qc === c)) {
                candidateQueue.push([r, c]);
            }
        }

        if (computerHits.length === 1) {
            neighbors.forEach(([r, c]) => addCandidate(r, c));

        } else {
            let [r0, c0] = computerHits[0];
            let [r1, c1] = computerHits[1];

            if (r0 === r1) {
                const cols = computerHits.map(([r, c]) => c);
                const minCol = Math.min(...cols);
                const maxCol = Math.max(...cols);
                candidateQueue.length = 0;

                addCandidate(r0, minCol - 1);
                addCandidate(r0, maxCol + 1);

            } else if (c0 === c1) {
                const rows = computerHits.map(([r, c]) => r);
                const minRow = Math.min(...rows);
                const maxRow = Math.max(...rows);
                candidateQueue.length = 0;

                addCandidate(minRow - 1, c0);
                addCandidate(maxRow + 1, c0);
            }
        }
    };

    const playComputerTurn = () => {
        let row, col, result;
        const enemyBoard = player2.getEnemyBoard().getBoard();

        const isValidTarget = (r, c) => {
            const cell = enemyBoard[r][c];
            return cell === null || (cell.ship && !cell.hit);
        }

        const handleHit = (row, col) => {
            const cell = player2.getEnemyBoard().getBoard()[row][col];
                const ship = cell.ship;

                if (ship.isSunk()) {
                    player2.getEnemyBoard().markForbidden(computerHits);
                    computerHits.length = 0;
                    candidateQueue.length = 0;
                } else {
                    computerHits.push([row, col]);
                    determineCandidates(row, col);
                } 
        }

        if (candidateQueue.length === 0) {
            do {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
            } while (!isValidTarget(row, col));

            result = player2.attack(row, col);
            if (result === "hit") handleHit(row, col);

        } else {
            [row, col] = candidateQueue.shift();
            result = player2.attack(row, col);

            if (result === "hit") handleHit(row, col);
        }

        dom.updateCell(".player-board", row, col, result);

        if (player1.getOwnBoard().allShipsSunk()) {
            alert("Computer wins!");
            document.querySelectorAll(".cell").forEach(cell => cell.classList.add("disabled"));
            return;
        }

        currentPlayer = player1;
    }

    return {
        init,
        placePlayerShip,
        toggleComputerBoardVisible,
        board: player1.getOwnBoard()
    }
}