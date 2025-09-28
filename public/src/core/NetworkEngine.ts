// core/NetworkEngine.js
import { Player } from "../components/player.js";
import { Zombie } from "../components/zombies.js";

const INTERPOLATION_DELAY = 100; // ms

interface BulletState {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

export class NetworkEngine {
    localEngine: any;
    socket: WebSocket;
    latency: number | null;
    pingInterval: number | null;
    playerId: string | null;
    roomId: string | null;
    otherPlayers: Record<string, Player>;
    otherBullets: BulletState[];
    nickname: string;
    selectedRoomId: string;
    otherZombies: Record<string, Zombie>;

    constructor(localEngine: any) {
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
        this.otherZombies = {};

        this.nickname = sessionStorage.getItem("nickname") || "Anonymous";
        this.selectedRoomId = sessionStorage.getItem("roomId") || "default";

        this.socket.addEventListener("open", () => {
            console.log("Connected to server");
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
                    // Update other players
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

                    // Update zombies
                    for (const zid in data.zombies) {
                        if (!this.otherZombies[zid]) {
                            this.otherZombies[zid] = new Zombie(zid, data.zombies[zid].x, data.zombies[zid].y, data.zombies[zid].hp);
                        }
                        this.otherZombies[zid].addSnapshot({
                            x: data.zombies[zid].x,
                            y: data.zombies[zid].y,
                            hp: data.zombies[zid].hp,
                            timestamp: data.serverTime
                        });
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

    startPing(): void {
        this.pingInterval = window.setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: "ping", clientTime: Date.now() }));
            }
        }, 1000);
    }

    updatePingUI(): void {
        const pingEl = document.getElementById("pingDisplay");
        if (!pingEl) return;

        const ms = this.latency ?? 0;
        let color = "text-green-400";
        if (ms > 150) color = "text-red-400";
        else if (ms > 80) color = "text-yellow-400";

        pingEl.className =
            "absolute bottom-2 right-4 text-sm font-bold bg-black bg-opacity-50 px-2 py-1 rounded " +
            color;
        pingEl.textContent = `Ping: ${ms} ms`;
    }

    send(data: Record<string, any>): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    sendMove(): void {
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

    sendShoot(x: number, y: number, angle: number): void {
        if (!this.playerId) return;
        this.send({
            type: "playerShoot",
            id: this.playerId,
            x, y, angle
        });
    }

    update(): void {
        const renderTimestamp = Date.now() - (this.latency ?? 0) - INTERPOLATION_DELAY;
        for (const id in this.otherPlayers) {
            this.otherPlayers[id].updateInterpolated(renderTimestamp);
        }

        for (const zid in this.otherZombies) {
            this.otherZombies[zid].updateInterpolated(renderTimestamp);
        }

        for (let i = this.otherBullets.length - 1; i >= 0; i--) {
            const b = this.otherBullets[i];
            b.x += b.dx;
            b.y += b.dy;
            if (
                b.x < 0 || b.x > this.localEngine.map.width ||
                b.y < 0 || b.y > this.localEngine.map.height
            ) {
                this.otherBullets.splice(i, 1);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, cam: { x: number; y: number }): void {
        for (const id in this.otherPlayers) {
            const p = this.otherPlayers[id];
            p.draw(ctx, cam);

            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(p.nickname || "???", p.renderX - cam.x, p.renderY - cam.y + 30);
        }

        for (const zid in this.otherZombies) {
            this.otherZombies[zid].draw(ctx, cam);
        }

        if (this.localEngine.player) {
            const self = this.localEngine.player;
            ctx.fillStyle = "cyan";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.nickname || "Me", self.x - cam.x, self.y - cam.y + 30);
        }

        ctx.fillStyle = "orange";
        this.otherBullets.forEach((b) => {
            ctx.beginPath();
            ctx.arc(b.x - cam.x, b.y - cam.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}