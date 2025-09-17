export default function domController() {
    let onAllShipsPlaced;
    let orientation = "horizontal";
    let placedCount = 0;

    const renderBoard = (board, selector, showShips = true) => {
        const container = document.querySelector(selector);
        container.innerHTML = "";

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                const cellData = board[row][col];

                if (cellData === "Miss") {
                    cell.classList.add("miss");
                } else if (cellData && cellData.hit === true) {
                    cell.classList.add("hit");
                }

                if (showShips && cellData?.ship) {
                    cell.classList.add("ship");
                }

                container.appendChild(cell);
            }
        }
    };

    function renderShipyard(ships) {
        const shipyard = document.querySelector("#shipyard");
        shipyard.innerHTML = "";
        placedCount = 0;
        let draggedShip = null;

        ships.forEach(ship => {
            const wrapper = document.createElement("div");
            wrapper.className = "ship-piece horizontal";
            wrapper.draggable = true;
            wrapper.shipObj = ship;
            wrapper.dataset.orientation = "horizontal";

            // grey-cell body
            const body = document.createElement("div");
            body.className = "ship-body";
            for (let i = 0; i < ship.getLength(); i++) {
                const cell = document.createElement("div");
                cell.className = "ship-cell";
                body.appendChild(cell);
            }
            wrapper.appendChild(body);

            // rotate button
            const rotateBtn = document.createElement("button");
            rotateBtn.type = "button";
            rotateBtn.className = "rotate-btn";
            rotateBtn.textContent = "⤾";
            rotateBtn.addEventListener("click", e => {
                e.stopPropagation();
                const newOri = wrapper.dataset.orientation === "horizontal" ? "vertical" : "horizontal";
                wrapper.dataset.orientation = newOri;
                wrapper.dataset.orientation = newOri;

                wrapper.classList.toggle("horizontal", newOri === "horizontal");
                wrapper.classList.toggle("vertical", newOri === "vertical");

                body.classList.toggle("vertical", newOri === "vertical");
            });
            wrapper.appendChild(rotateBtn);

            shipyard.appendChild(wrapper);
        });

        shipyard.addEventListener("dragstart", e => {
            const piece = e.target.closest(".ship-piece");
            if (piece) {
                draggedShip = piece;
                piece.classList.add("dragging");
            }
        });

        shipyard.addEventListener("dragend", () => {
            if (draggedShip) {
                draggedShip.classList.remove("dragging");
                draggedShip = null;
            }
        });

        const board = document.querySelector(".player-board");
        board.addEventListener("dragover", e => e.preventDefault());
        board.addEventListener("drop", e => {
            e.preventDefault();
            if (!draggedShip) return;

            const cell = e.target.closest(".cell");
            if (!cell) return;

            const row = +cell.dataset.row;
            const col = +cell.dataset.col;
            const orientation = draggedShip.dataset.orientation || "horizontal";

            const placed = window.game.placePlayerShip(draggedShip.shipObj, row, col, orientation);
            if (placed) {
                draggedShip.remove();
                placedCount++;
                renderBoard(window.game.board.getBoard(), ".player-board", true);

                if (placedCount === ships.length && typeof onAllShipsPlaced === "function") {
                    onAllShipsPlaced();
                }
            } else {
                cell.classList.add("invalid");
                setTimeout(() => cell.classList.remove("invalid"), 300);
            }
        });
    }

    const bindCellClicks = (selector, callback) => {
        const cells = document.querySelectorAll(`${selector} .cell`);
        cells.forEach(cell => {
            cell.addEventListener("click", () => {
                if (cell.classList.contains("disabled")) return;
                const row = parseInt(cell.dataset.row, 10);
                const col = parseInt(cell.dataset.col, 10);
                callback(row, col);
            });
        });
    };

    const updateCell = (selector, row, col, result) => {
        const cell = document.querySelector(
            `${selector} .cell[data-row="${row}"][data-col="${col}"]`
        );
        if (!cell) return;

        cell.classList.remove("hit", "miss");
        if (result === "hit") cell.classList.add("hit");
        if (result === "miss") cell.classList.add("miss");
    };

    const bindToggleComputerBoard = (onToggle) => {
        const btn = document.getElementById("show-hide-btn");
        btn.addEventListener("click", onToggle);
    };

    return {
        renderBoard,
        renderShipyard,
        bindCellClicks,
        updateCell,
        bindToggleComputerBoard,
        endGame: msg => alert(msg),
        set onAllShipsPlaced(cb) { onAllShipsPlaced = cb; },
    };
}