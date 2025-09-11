import "./style.css";
import gameController from "./gameController.js";

document.addEventListener("DOMContentLoaded", () => {
    const game = gameController();
    game.init();
})