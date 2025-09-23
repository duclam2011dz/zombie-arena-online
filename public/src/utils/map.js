export class GameMap {
    constructor(width = 2000, height = 2000, gridSize = 50) {
        this.width = width;
        this.height = height;
        this.gridSize = gridSize;
    }

    draw(ctx, cam) {
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1;

        for (let x = 0; x < this.width; x += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x - cam.x, 0 - cam.y);
            ctx.lineTo(x - cam.x, this.height - cam.y);
            ctx.stroke();
        }

        for (let y = 0; y < this.height; y += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0 - cam.x, y - cam.y);
            ctx.lineTo(this.width - cam.x, y - cam.y);
            ctx.stroke();
        }
    }
}