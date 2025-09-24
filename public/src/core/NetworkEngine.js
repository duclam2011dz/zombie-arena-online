import { Optimization } from '../components/optimization.js';

export class NetworkEngine {
    constructor(localEngine) {
        this.localEngine = localEngine;
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const host = window.location.host;
        this.socket = new WebSocket(`${protocol}://${host}`);
        this.latency = null;
        this.pingInterval = null;
        this.playerId = null;

        this.otherPlayers = {};
        this.otherBullets = [];

        this.socket.addEventListener("open", () => {
            console.log("Connected to server");
            this.startPing();
        });

        this.socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "init":
                    this.playerId = data.id;
                    break;

                case "state":
                    this.otherPlayers = { ...data.players };
                    delete this.otherPlayers[this.playerId];
                    break;

                case "playerMove":
                    if (data.id !== this.playerId) {
                        if (!this.otherPlayers[data.id]) {
                            this.otherPlayers[data.id] = { x: data.x, y: data.y, angle: data.angle };
                        } else {
                            Object.assign(this.otherPlayers[data.id], data);
                        }
                    }
                    break;

                case "playerShoot":
                    if (data.id !== this.playerId) {
                        this.otherBullets.push({
                            x: data.x,
                            y: data.y,
                            dx: Math.cos(data.angle) * 7,
                            dy: Math.sin(data.angle) * 7
                        });
                    }
                    break;

                case "playerDisconnect":
                    delete this.otherPlayers[data.id];
                    break;

                case "pong":
                    const now = Date.now();
                    this.latency = now - data.clientTime;
                    this.updatePingUI();
                    break;
            }
        });

        this.socket.addEventListener("close", () => {
            console.log("Disconnected from server");
        });
    }

    startPing() {
        this.pingInterval = setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: "ping", clientTime: Date.now() }));
            }
        }, 1000);
    }

    updatePingUI() {
        const pingEl = document.getElementById("pingDisplay");
        if (!pingEl) return;

        const ms = this.latency;
        let color = "text-green-400";
        if (ms > 150) color = "text-red-400";
        else if (ms > 80) color = "text-yellow-400";

        pingEl.className =
            "absolute bottom-2 right-4 text-sm font-bold bg-black bg-opacity-50 px-2 py-1 rounded " +
            color;
        pingEl.textContent = `Ping: ${ms} ms`;
    }

    send(data) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    sendMove() {
        if (!this.playerId) return;
        this.send({
            type: "playerMove",
            id: this.playerId,
            x: this.localEngine.player.x,
            y: this.localEngine.player.y,
            angle: this.localEngine.player.angle
        });
    }

    sendShoot(x, y, angle) {
        if (!this.playerId) return;
        this.send({
            type: "playerShoot",
            id: this.playerId,
            x, y, angle
        });
    }

    update() {
        // Cập nhật trạng thái của player và bullet từ server
        for (let id in this.otherPlayers) {
            const p = this.otherPlayers[id];
            const clientState = this.localEngine.player; // Trạng thái client
            const serverState = p; // Trạng thái server

            // Tính toán Interpolation cho mỗi player
            const interpolationTime = 0.1; // Thời gian interpolation (có thể thay đổi tuỳ vào nhu cầu)
            const optimization = new Optimization(clientState, serverState, interpolationTime);
            this.otherPlayers[id] = optimization.applyInterpolation();
        }

        // Cập nhật trạng thái của bullets từ server
        for (let i = 0; i < this.otherBullets.length; i++) {
            const bullet = this.otherBullets[i];
            const clientBullet = this.localEngine.bullets.list[i]; // Trạng thái bullet client
            const serverBullet = bullet; // Trạng thái bullet server

            // Tính toán Interpolation cho mỗi bullet
            const optimization = new Optimization(clientBullet, serverBullet, interpolationTime);
            this.otherBullets[i] = optimization.applyInterpolation();
        }
    }

    draw(ctx, cam) {
        // draw other players
        for (const id in this.otherPlayers) {
            const p = this.otherPlayers[id];
            ctx.save();
            ctx.translate(p.x - cam.x, p.y - cam.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = "cyan";
            ctx.fillRect(-10, -10, 20, 20);
            ctx.fillStyle = "white";
            ctx.fillRect(10, -5, 15, 10);
            ctx.restore();
        }

        // draw bullets from other players
        ctx.fillStyle = "orange";
        this.otherBullets.forEach((b) => {
            ctx.beginPath();
            ctx.arc(b.x - cam.x, b.y - cam.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}