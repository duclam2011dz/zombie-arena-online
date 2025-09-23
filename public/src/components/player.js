export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 4;
        this.angle = 0;
    }

    update(input, map) {
        if (input.keys["w"]) this.y -= this.speed;
        if (input.keys["s"]) this.y += this.speed;
        if (input.keys["a"]) this.x -= this.speed;
        if (input.keys["d"]) this.x += this.speed;

        // Clamp player inside map
        this.x = Math.max(this.size, Math.min(map.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(map.height - this.size, this.y));
    }

    draw(ctx, cam) {
        ctx.save();
        ctx.translate(this.x - cam.x, this.y - cam.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = "lime";
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.fillStyle = "white";
        ctx.fillRect(this.size / 2, -5, 15, 10); // gun
        ctx.restore();
    }
}