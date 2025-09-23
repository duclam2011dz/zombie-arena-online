export class Camera {
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;
    }

    getPosition() {
        return {
            x: this.player.x - this.canvas.width / 2,
            y: this.player.y - this.canvas.height / 2
        };
    }
}