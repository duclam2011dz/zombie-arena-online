export interface ZombieSnapshot {
    x: number;
    y: number;
    hp: number;
    timestamp: number;
}

export class Zombie {
    id: string;
    snapshots: ZombieSnapshot[];
    renderX: number;
    renderY: number;
    hp: number;

    constructor(id: string, x: number, y: number, hp: number) {
        this.id = id;
        this.snapshots = [];
        this.renderX = x;
        this.renderY = y;
        this.hp = hp;
    }

    addSnapshot(snapshot: ZombieSnapshot): void {
        this.snapshots.push(snapshot);
        if (this.snapshots.length > 10) this.snapshots.shift();
    }

    updateInterpolated(renderTimestamp: number): void {
        while (this.snapshots.length >= 2 && this.snapshots[1].timestamp <= renderTimestamp) {
            this.snapshots.shift();
        }
        if (this.snapshots.length >= 2) {
            const s0 = this.snapshots[0];
            const s1 = this.snapshots[1];
            const t = (renderTimestamp - s0.timestamp) / (s1.timestamp - s0.timestamp);
            this.renderX = s0.x + (s1.x - s0.x) * t;
            this.renderY = s0.y + (s1.y - s0.y) * t;
            this.hp = s0.hp; // đơn giản: lấy từ snapshot cũ
        } else if (this.snapshots.length === 1) {
            this.renderX = this.snapshots[0].x;
            this.renderY = this.snapshots[0].y;
            this.hp = this.snapshots[0].hp;
        }
    }

    checkBulletCollision(bullets: any[]): void {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            const dx = b.x - this.renderX;
            const dy = b.y - this.renderY;
            const dist2 = dx * dx + dy * dy;

            if (dist2 < 20 * 20) {
                this.hp -= 10;
                if (this.hp <= 0) {
                    this.hp = 0;
                }
                bullets.splice(i, 1);
                break;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, cam: { x: number; y: number }): void {
        // zombie body
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(this.renderX - cam.x, this.renderY - cam.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // health bar background
        const barWidth = 30;
        const barHeight = 5;
        const barX = this.renderX - cam.x - barWidth / 2;
        const barY = this.renderY - cam.y - 30;

        ctx.fillStyle = "red";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // health foreground
        ctx.fillStyle = "lime";
        const hpRatio = Math.max(this.hp, 0) / 100;
        ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }
}