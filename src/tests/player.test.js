import Player from "../player.js";
import GameBoard from "../gameboard.js";
import Ship from "../ship.js";

describe("Player creation", () => {
    test("creates a player with a gameboard", () => {
        const player1 = Player("user");
        const player2 = Player("computer");

        expect(player1.getType()).toBe("user");
        expect(player2.getType()).toBe("computer");
        expect(player1.getOwnBoard()).toBeDefined();
        expect(player2.getOwnBoard()).toBeDefined();
    });
});

describe("Player can attack", () => {
    test("player can set an enemy board", () => {
        const player = Player("user");
        const enemyBoard = GameBoard();
        player.setEnemyBoard(enemyBoard);
        expect(player.getEnemyBoard()).toBe(enemyBoard);
    });

    test("attack misses on empty cell", () => {
        const player = Player("user");
        const enemyBoard = GameBoard();
        player.setEnemyBoard(enemyBoard);
        const result = player.attack(0, 0);

        expect(result).toBe("miss");
        expect(player.getEnemyBoard().getBoard()[0][0]).toBe("Miss")
    });

    test("attack hits a ship", () => {
        const player = Player("user");
        const enemyBoard = GameBoard();
        const ship = Ship(3);
        enemyBoard.placeShip(0, 0, ship, "horizontal");
        player.setEnemyBoard(enemyBoard);
        const result = player.attack(0, 0);
        
        expect(result).toBe("hit");
        expect(player.getEnemyBoard().getBoard()[0][0].hit).toBe(true);
        expect(ship.getHits()).toBe(1);
    });

    test("attack on already attacked cell returns false", () => {
        const player = Player("user");
        const enemyBoard = GameBoard();
        player.setEnemyBoard(enemyBoard);

        player.attack(0, 0);
        const result = player.attack(0, 0);
        expect(result).toBe("Already attacked");
    });
});

describe("Ship placement", () => {
    test("Random ship placement creates 5 ships", () => {
        const player = Player("computer");
        player.randomlyPlaceShips();
        const shipsOnBoard = player.getOwnBoard().getShips();

        expect(shipsOnBoard.length).toBe(5);
    });

    test("Random ship placement fills cells on the board", () => {
        const player = Player("computer");
        player.randomlyPlaceShips();
        const board = player.getOwnBoard().getBoard();

        const occupiedCells = board.flat().filter(cell => cell !== null);
        expect(occupiedCells.length).toBe(17); // 17 is the cumulated length of all ships
    })
});