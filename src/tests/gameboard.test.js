import GameBoard from "../gameboard.js";
import Ship from "../ship.js";

describe("Board creation", () => {
    test("creates an empty 10x10 board", () => {
        const board = GameBoard().getBoard();
    
        expect(board.length).toBe(10);
        board.forEach(row => expect(row.length).toBe(10));
    });
});

describe("placeShip method", () => {
    test("place a ship(3) horizontally on the board", () => {
        const board = GameBoard();
        const ship = Ship(3);
        const direction = "horizontal";
        const row = 0;
        const column = 0;
        board.placeShip(row, column, ship, direction);
    
        expect(board.getBoard()[row][column]).toEqual({ ship, hit: false });
        expect(board.getBoard()[row][column + 1]).toEqual({ ship, hit: false });
        expect(board.getBoard()[row][column + 2]).toEqual({ ship, hit: false });
    });
    
    test("place a ship(4) horizontally on the board", () => {
        const board = GameBoard();
        const ship = Ship(4);
        const direction = "horizontal";
        const row = 0;
        const column = 0;
        board.placeShip(row, column, ship, direction);
    
        expect(board.getBoard()[row][column]).toEqual({ ship, hit: false });
        expect(board.getBoard()[row][column + 1]).toEqual({ ship, hit: false });
        expect(board.getBoard()[row][column + 2]).toEqual({ ship, hit: false });
        expect(board.getBoard()[row][column + 3]).toEqual({ ship, hit: false });
    });
    
    test("place a ship(3) vertically on the board", () => {
        const board = GameBoard();
        const ship = Ship(3);
        const direction = "vertical";
        const row = 0;
        const column = 0;
        board.placeShip(row, column, ship, direction);
    
        expect(board.getBoard()[row][column]).toEqual({ ship, hit: false });
        expect(board.getBoard()[row + 1][column]).toEqual({ ship, hit: false });
        expect(board.getBoard()[row + 2][column]).toEqual({ ship, hit: false });
    })
    
    test("place a ship(5) out of bounds", () => {
        const board = GameBoard();
        const ship = Ship(5);
        const direction = "horizontal";
        const row = 0;
        const column = 7;
    
        expect(board.placeShip(row, column, ship, direction)).toBe(false);
    });
    
    test("Ships overlapping", () => {
        const board = GameBoard();
        const ship = Ship(3);
        const direction = "vertical";
        const row = 0;
        const column = 0;
        board.placeShip(row, column, ship, direction);
    
        expect(board.placeShip(row, column, ship, "horizontal")).toBe(false);
    });
});

describe("receiveAttack method", () => {
    test("missed attack", () => {
        const board = GameBoard();
        board.receiveAttack(0, 0);

        expect(board.getBoard()[0][0]).toBe("Miss");
    });

    test("hit attack", () => {
        const board = GameBoard();
        const ship = Ship(3);
        const row = 0;
        const column = 0;
        const direction = "horizontal";
        board.placeShip(row, column, ship, direction);
        board.receiveAttack(0, 0);

        expect(board.getBoard()[0][0]).toEqual({ ship, hit: true });
        expect(ship.getHits()).toBe(1);
        expect(ship.isSunk()).toBe(false);
    });

    test("multiple hits on same cell don't increase ship hits again", () => {
        const board = GameBoard();
        const ship = Ship(2);
        board.placeShip(0, 0, ship, "horizontal");

        board.receiveAttack(0, 0);
        board.receiveAttack(0, 0);

        expect(ship.getHits()).toBe(1);
    });

    test("sinks the ship after all positions are hit", () => {
        const board = GameBoard();
        const ship = Ship(2);
        board.placeShip(0, 0, ship, "horizontal");

        board.receiveAttack(0, 0);
        board.receiveAttack(0, 1);

        expect(ship.isSunk()).toBe(true);
    });

    test("attacking a missed cell doesn't change it", () => {
        const board = GameBoard();
        board.receiveAttack(0, 0); 
        board.receiveAttack(0, 0);

        expect(board.getBoard()[0][0]).toBe("Miss");
    });

    test("hits on different ships update each one correctly", () => {
        const board = GameBoard();
        const ship1 = Ship(2);
        const ship2 = Ship(3);
        board.placeShip(0, 0, ship1, "horizontal");
        board.placeShip(1, 0, ship2, "horizontal");

        board.receiveAttack(0, 0);
        board.receiveAttack(1, 0);

        expect(ship1.getHits()).toBe(1);
        expect(ship2.getHits()).toBe(1);
    });
});

describe("allShipsSunk method", () => {
    test("allShipsSunk returns true only after all ships are sunk", () => {
        const board = GameBoard();
        const ship1 = Ship(2);
        const ship2 = Ship(3);

        board.placeShip(0, 0, ship1, "horizontal");
        board.placeShip(1, 0, ship2, "horizontal");

        expect(board.allShipsSunk()).toBe(false);

        board.receiveAttack(0, 0);
        board.receiveAttack(0, 1);
        expect(ship1.isSunk()).toBe(true);
        expect(board.allShipsSunk()).toBe(false);
        
        board.receiveAttack(1, 0);
        board.receiveAttack(1, 1);
        board.receiveAttack(1, 2);
        expect(ship2.isSunk()).toBe(true);
        expect(board.allShipsSunk()).toBe(true);
    });
});
