export default function domController() {
    const renderBoard = (board, selector, showShips = true) => {
        const container = document.querySelector(selector);
        container.innerHTML = "";

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (showShips && board[row][col]?.ship) {
                    cell.classList.add("ship");
                }

                container.appendChild(cell);
            }
        }
    };

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

    return {
        renderBoard,
        bindCellClicks,
        updateCell,
    };
}