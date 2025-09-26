// public/src/utils/camera.ts

import { Player } from "../components/player.js";

export class Camera {
    player: Player;
    canvas: HTMLCanvasElement;

    constructor(player: Player, canvas: HTMLCanvasElement) {
        this.player = player;
        this.canvas = canvas;
    }

    getPosition(): { x: number; y: number } {
        return {
            x: this.player.x - this.canvas.width / 2,
            y: this.player.y - this.canvas.height / 2
        };
    }
}