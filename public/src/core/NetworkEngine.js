export class NetworkEngine {
    constructor(localEngine, url = "ws://localhost:3000") {
        this.localEngine = localEngine;
        this.socket = new WebSocket(url);
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