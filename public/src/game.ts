import { LocalEngine } from "./core/LocalEngine.js";
import { NetworkEngine } from "./core/NetworkEngine.js";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

let networkEngine: NetworkEngine;
let localEngine: LocalEngine;

function startGame(): void {
    networkEngine = new NetworkEngine(null as any); // init first
    localEngine = new LocalEngine(canvas, networkEngine);
    networkEngine.localEngine = localEngine; // link back

    localEngine.start();
}

startGame();