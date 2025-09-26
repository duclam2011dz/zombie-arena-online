// components/bullet.ts

export class Bullet {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;

    constructor(x: number, y: number, angle: number, speed = 7) {
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
        this.radius = 5;
    }

    /**
     * Update bullet position.
     * @param map game map with width/height
     * @returns true if bullet is out of map
     */
    update(map: { width: number; height: number }): boolean {
        this.x += this.dx;
        this.y += this.dy;

        return (
            this.x < 0 || this.x > map.width ||
            this.y < 0 || this.y > map.height
        );
    }

    draw(ctx: CanvasRenderingContext2D, cam: { x: number; y: number }): void {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x - cam.x, this.y - cam.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}