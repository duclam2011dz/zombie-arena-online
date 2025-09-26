// public/src/utils/input.ts
export class Input {
    constructor(canvas, player, bullets, networkEngine) {
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
//# sourceMappingURL=input.js.map