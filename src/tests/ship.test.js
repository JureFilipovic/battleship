import Ship from "../ship.js"

test("getLength", () => {
    const ship = Ship(3);
    expect(ship.getLength()).toBe(3);
});

test("getHits", () => {
    const ship = Ship(5);
    expect(ship.getHits()).toBe(0);
});

test("hit - true", () => {
    const ship = Ship(5);
    expect(ship.hit()).toBe(true);
    expect(ship.getHits()).toBe(1);
});

test("hit - false", () => {
    const ship = Ship(2);
    ship.hit();
    ship.hit();

    expect(ship.hit()).toBe(false);
    expect(ship.getHits()).toBe(2);
    expect(ship.isSunk()).toBe(true);
});

test("isSunk - true", () => {
    const ship = Ship(5);
    
    for (let i = 0; i < 5; i++) {
        ship.hit();
    }

    expect(ship.getHits()).toBe(5);
    expect(ship.isSunk()).toBe(true);
});

test("isSunk - false", () => {
    const ship = Ship(6);
    
    for (let i = 0; i < 5; i++) {
        ship.hit();
    }

    expect(ship.getHits()).toBe(5);
    expect(ship.isSunk()).toBe(false);
});