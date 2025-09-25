// components/player.js
import { interpolateSnapshot } from "../utils/interpolation.js";

export class Player {
    constructor(x, y, isLocal = false) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 4;
        this.angle = 0;

        this.isLocal = isLocal;

        // For remote players
        this.stateBuffer = [];
        this.renderX = x;
        this.renderY = y;
        this.renderAngle = 0;
    }

    update(input, map) {
        if (!this.isLocal) return;

        if (input.keys["w"]) this.y -= this.speed;
        if (input.keys["s"]) this.y += this.speed;
        if (input.keys["a"]) this.x -= this.speed;
        if (input.keys["d"]) this.x += this.speed;

        // Clamp player inside map
        this.x = Math.max(this.size, Math.min(map.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(map.height - this.size, this.y));
    }

    addSnapshot(snapshot) {
        this.stateBuffer.push(snapshot);

        // Keep only last ~20 snapshots
        if (this.stateBuffer.length > 20) {
            this.stateBuffer.shift();
        }
    }

    updateInterpolated(renderTimestamp) {
        if (this.isLocal) return;

        const state = interpolateSnapshot(this.stateBuffer, renderTimestamp);
        if (state) {
            this.renderX = state.x;
            this.renderY = state.y;
            this.renderAngle = state.angle;
        } else if (this.stateBuffer.length > 0) {
            // fallback: use latest snapshot
            const latest = this.stateBuffer[this.stateBuffer.length - 1];
            this.renderX = latest.x;
            this.renderY = latest.y;
            this.renderAngle = latest.angle;
        }
    }

    draw(ctx, cam) {
        ctx.save();
        const drawX = this.isLocal ? this.x : this.renderX;
        const drawY = this.isLocal ? this.y : this.renderY;
        const drawAngle = this.isLocal ? this.angle : this.renderAngle;

        ctx.translate(drawX - cam.x, drawY - cam.y);
        ctx.rotate(drawAngle);
        ctx.fillStyle = this.isLocal ? "lime" : "cyan";
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.fillStyle = "white";
        ctx.fillRect(this.size / 2, -5, 15, 10); // gun
        ctx.restore();
    }
}