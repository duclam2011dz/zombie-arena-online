// core/NetworkEngine.js
import { Player } from "../components/player.js";

const INTERPOLATION_DELAY = 100; // ms

export class NetworkEngine {
    constructor(localEngine) {
        this.localEngine = localEngine;
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const host = window.location.host;
        this.socket = new WebSocket(`${protocol}://${host}`);
        this.latency = null;
        this.pingInterval = null;
        this.playerId = null;
        this.roomId = null;

        this.otherPlayers = {};
        this.otherBullets = [];

        // lấy từ sessionStorage
        this.nickname = sessionStorage.getItem("nickname") || "Anonymous";
        this.selectedRoomId = sessionStorage.getItem("roomId") || "default";

        this.socket.addEventListener("open", () => {
            console.log("Connected to server");
            // gửi joinRoom ngay khi connect
            this.send({
                type: "joinRoom",
                roomId: this.selectedRoomId,
                nickname: this.nickname
            });
            this.startPing();
        });

        this.socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "init":
                    this.playerId = data.id;
                    this.roomId = data.roomId;
                    console.log(`Joined room ${this.roomId} as ${this.playerId}`);
                    break;

                case "state":
                    for (const id in data.players) {
                        if (id === this.playerId) continue;
                        if (!this.otherPlayers[id]) {
                            this.otherPlayers[id] = new Player(data.players[id].x, data.players[id].y, false);
                        }
                        const p = this.otherPlayers[id];
                        p.addSnapshot({
                            x: data.players[id].x,
                            y: data.players[id].y,
                            angle: data.players[id].angle,
                            timestamp: data.serverTime
                        });
                        p.nickname = data.players[id].nickname || "???";
                    }
                    break;

                case "playerMove":
                    if (data.id !== this.playerId) {
                        if (!this.otherPlayers[data.id]) {
                            this.otherPlayers[data.id] = new Player(data.x, data.y, false);
                        }
                        const p = this.otherPlayers[data.id];
                        p.addSnapshot({
                            x: data.x,
                            y: data.y,
                            angle: data.angle,
                            timestamp: data.serverTime
                        });
                        p.nickname = data.nickname || "???";
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
                    this.latency = Date.now() - data.clientTime;
                    this.updatePingUI();
                    break;

                case "error":
                    alert(data.message);
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
            angle: this.localEngine.player.angle,
            nickname: this.nickname
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
        // update other players' interpolated states
        const renderTimestamp = Date.now() - this.latency - INTERPOLATION_DELAY;
        for (const id in this.otherPlayers) {
            this.otherPlayers[id].updateInterpolated(renderTimestamp);
        }

        // update other players' bullets
        for (let i = this.otherBullets.length - 1; i >= 0; i--) {
            const b = this.otherBullets[i];
            b.x += b.dx;
            b.y += b.dy;
            if (b.x < 0 || b.x > this.localEngine.map.width || b.y < 0 || b.y > this.localEngine.map.height) {
                this.otherBullets.splice(i, 1);
            }
        }
    }

    draw(ctx, cam) {
        // draw other players
        for (const id in this.otherPlayers) {
            const p = this.otherPlayers[id];
            p.draw(ctx, cam);

            // draw nickname
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(p.nickname || "???", p.renderX - cam.x, p.renderY - cam.y + 30);
        }

        // vẽ nickname của chính mình
        if (this.localEngine.player) {
            const self = this.localEngine.player;
            ctx.fillStyle = "cyan";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.nickname || "Me", self.x - cam.x, self.y - cam.y + 30);
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