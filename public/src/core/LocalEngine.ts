// core/LocalEngine.js
import { Player } from "../components/player.js";

import { GameMap } from "../utils/map.js";
import { Camera } from "../utils/camera.js";
import { Input } from "../utils/input.js";
import type { NetworkEngine } from "./NetworkEngine.js";

export class LocalEngine {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    map: GameMap;
    player: Player;
    camera: Camera;
    networkEngine: NetworkEngine | null;
    input: Input;

    constructor(canvas: HTMLCanvasElement, networkEngine: NetworkEngine | null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.map = new GameMap();
        this.player = new Player(this.map.width / 2, this.map.height / 2, true);
        this.camera = new Camera(this.player, canvas);

        this.networkEngine = networkEngine;
        this.input = new Input(canvas, this.player, networkEngine || undefined);

        window.addEventListener("resize", () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update(): void {
        this.player.update(this.input, this.map);

        const cam = this.camera.getPosition();
        this.player.angle = Math.atan2(
            this.input.mouseY + cam.y - this.player.y,
            this.input.mouseX + cam.x - this.player.x
        );

        if (this.networkEngine) {
            this.networkEngine.sendMove();
            this.networkEngine.update();
        }
    }

    draw(): void {
        const cam = this.camera.getPosition();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.map.draw(this.ctx, cam);
        this.player.draw(this.ctx, cam);

        if (this.networkEngine) {
            this.networkEngine.draw(this.ctx, cam);
        }
    }

    loop(): void {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    start(): void {
        this.loop();
    }
}