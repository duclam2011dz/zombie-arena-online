// public/src/utils/input.ts

import { Player } from "../components/player.js";

export class Input {
    keys: Record<string, boolean>;
    mouseX: number;
    mouseY: number;

    constructor(
        canvas: HTMLCanvasElement,
        player: Player,
        bullets: { spawn: (x: number, y: number, angle: number) => void },
        networkEngine?: { sendShoot: (x: number, y: number, angle: number) => void }
    ) {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;

        document.addEventListener("keydown", (e) => (this.keys[e.key.toLowerCase()] = true));
        document.addEventListener("keyup", (e) => (this.keys[e.key.toLowerCase()] = false));

        canvas.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        canvas.addEventListener("mousedown", () => {
            bullets.spawn(player.x, player.y, player.angle);
            if (networkEngine) {
                networkEngine.sendShoot(player.x, player.y, player.angle);
            }
        });
    }
}