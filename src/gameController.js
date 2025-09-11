import Player from "./player.js";
import domController from "./domController.js";

export default function gameController() {
    const player1 = Player("user");
    const player2 = Player("computer");
    const dom = domController();

    const init = () => {
        player1.randomlyPlaceShips();
        player2.randomlyPlaceShips();

        player1.setEnemyBoard(player2.getOwnBoard());
        player2.setEnemyBoard(player1.getOwnBoard());

        dom.renderBoard(player1.getOwnBoard().getBoard(), ".player-board", true);
        dom.renderBoard(player2.getOwnBoard().getBoard(), ".enemy-board", true);

    };

    return {
        init,

    }
}