import { LocalEngine } from "./core/LocalEngine.js";
import { NetworkEngine } from "./core/NetworkEngine.js";

const canvas = document.getElementById("gameCanvas");

let networkEngine;
let localEngine;

function startGame() {
    networkEngine = new NetworkEngine(null); // init first
    localEngine = new LocalEngine(canvas, networkEngine);
    networkEngine.localEngine = localEngine; // link back

    localEngine.start();
}

startGame();