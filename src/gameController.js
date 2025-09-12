import Player from "./player.js";
import domController from "./domController.js";

export default function gameController() {
    const player1 = Player("user");
    const player2 = Player("computer");
    const dom = domController();
    let currentPlayer = player1;

    const init = () => {
        player1.randomlyPlaceShips();
        player2.randomlyPlaceShips();

        player1.setEnemyBoard(player2.getOwnBoard());
        player2.setEnemyBoard(player1.getOwnBoard());

        dom.renderBoard(player1.getOwnBoard().getBoard(), ".player-board", true);
        dom.renderBoard(player2.getOwnBoard().getBoard(), ".enemy-board", true);

        dom.bindCellClicks(".enemy-board", handlePlayerMove);
    };

    const handlePlayerMove = (row, col) => {
        if (currentPlayer !== player1) return;

        const result = player1.attack(row, col);
        dom.updateCell(".enemy-board", row, col, result);

        if (player2.getOwnBoard().allShipsSunk()) {
            alert("You win!");
            document.querySelectorAll(".cell").forEach(cell => cell.classList.add("disabled"));
            return;
        }

        currentPlayer = player2;
        playComputerTurn();
    };

    const playComputerTurn = () => {
        let row, col, result;
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            result = player2.attack(row, col);
        } while (result === "Already attacked");

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

    }
}