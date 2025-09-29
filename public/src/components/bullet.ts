// components/bullet.ts
import { interpolateSnapshot, Snapshot } from "../utils/interpolation.js";
import { predictPosition } from "../utils/prediction.js";

export class Bullet {
    id: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    angle: number;
    width: number;
    height: number;
    snapshots: Snapshot[];
    visible: boolean;

    constructor(id: string, x: number, y: number, dx: number, dy: number, angle: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.angle = angle;
        this.width = 12;   // viên đạn hình chữ nhật
        this.height = 4;
        this.snapshots = [];
        this.visible = false;
    }

    addSnapshot(snapshot: Snapshot): void {
        this.snapshots.push(snapshot);
        if (this.snapshots.length >= 2) {
            this.visible = true;
        }
        if (this.snapshots.length > 10) this.snapshots.shift();
    }

    update(renderTimestamp: number): void {
        if (this.snapshots.length < 2) {
            // chưa có đủ dữ liệu → đợi, không vẽ
            return;
        }

        const interp = interpolateSnapshot(this.snapshots, renderTimestamp);
        if (interp) {
            this.x = interp.x;
            this.y = interp.y;
            this.angle = interp.angle;
        }
    }

    draw(ctx: CanvasRenderingContext2D, cam: { x: number; y: number }): void {
        if (!this.visible) return;
        ctx.save();
        ctx.translate(this.x - cam.x, this.y - cam.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = "yellow";
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}