// server/src/core/NetworkEngine.js
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { RoomManager } from "./RoomManager.js";
import { logInfo, logSuccess, logWarn } from "../utils/logging.js";
import { ZombieManager } from "./ZombieManager.js";

interface ExtWebSocket extends WebSocket {
    id?: string;
    roomId?: string;
}

interface ClientMessage {
    type: string;
    [key: string]: any;
}

export class NetworkEngine {
    private wss: WebSocketServer;
    public roomManager: RoomManager;
    private zombieManager: ZombieManager;

    constructor(server: any) {
        this.wss = new WebSocketServer({ server });
        this.roomManager = new RoomManager();
        this.zombieManager = new ZombieManager(this.roomManager);
        (global as any).zombieManager = this.zombieManager;

        this.wss.on("connection", (ws: ExtWebSocket) => {
            const id = uuidv4();
            ws.id = id;

            logSuccess(`Client ${id} connected`);

            ws.on("message", (msg: Buffer) => {
                const data: ClientMessage = JSON.parse(msg.toString());

                if (data.type === "requestRooms") {
                    this.roomManager.sendTo(ws, {
                        type: "roomsList",
                        rooms: this.roomManager.getRooms(),
                    });
                    return;
                }

                if (data.type === "createRoom") {
                    this.roomManager.createRoom(data.roomId, data.maxPlayers || 10);
                    this.broadcastRoomsList();
                    return;
                }

                if (data.type === "joinRoom") {
                    const player = this.roomManager.joinRoom(
                        data.roomId,
                        id,
                        ws,
                        data.nickname
                    );
                    if (!player) {
                        this.roomManager.sendTo(ws, {
                            type: "error",
                            message: "Room full or not exist",
                        });
                        return;
                    }
                    this.roomManager.sendTo(ws, { type: "init", id, roomId: data.roomId });
                    this.broadcastRoomsList();
                    return;
                }

                if (data.type === "ping") {
                    this.roomManager.sendTo(ws, {
                        type: "pong",
                        clientTime: data.clientTime,
                        serverTime: Date.now(),
                    });
                    return;
                }

                if (data.type === "playerMove") {
                    const player = this.roomManager.getPlayers(ws.roomId!)[id];
                    this.roomManager.updatePlayer(
                        ws.roomId!,
                        id,
                        data.x,
                        data.y,
                        data.angle
                    );

                    this.roomManager.broadcastToRoom(
                        ws.roomId!,
                        {
                            type: "playerMove",
                            id,
                            x: data.x,
                            y: data.y,
                            angle: data.angle,
                            nickname: player.nickname,
                            serverTime: Date.now(),
                        },
                        id
                    );
                    return;
                }

                if (data.type === "playerShoot") {
                    const player = this.roomManager.getPlayers(ws.roomId!)[id];
                    if (!player.bullets) player.bullets = [];

                    const speed = 15;
                    const dx = Math.cos(data.angle) * speed;
                    const dy = Math.sin(data.angle) * speed;

                    const playerSize = 20;
                    const bulletLength = 12;
                    const offset = playerSize / 2 + bulletLength / 2;

                    const spawnX = data.x + Math.cos(data.angle) * offset;
                    const spawnY = data.y + Math.sin(data.angle) * offset;

                    player.bullets.push({
                        id: crypto.randomUUID(),
                        x: spawnX,
                        y: spawnY,
                        dx,
                        dy,
                        angle: data.angle,
                        width: bulletLength,
                        height: 4,
                        owner: ws.id!,
                    });
                    return;
                }
            });

            ws.on("close", () => {
                logWarn(`Client ${id} disconnected`);
                if (ws.roomId) {
                    this.roomManager.leaveRoom(ws.roomId, id, ws);
                    this.roomManager.broadcastToRoom(ws.roomId, {
                        type: "playerDisconnect",
                        id,
                    });
                    this.broadcastRoomsList();
                }
            });
        });

        setInterval(() => {
            for (const [roomId] of this.roomManager.rooms) {
                const players = this.roomManager.getPlayers(roomId);
                const zombies = this.zombieManager.getZombies(roomId);
                const bullets = Object.values(players).flatMap(p => p.bullets || []);

                // Collision bullet ↔ zombie
                for (const pid in players) {
                    const p = players[pid];
                    if (!p.bullets) continue;

                    for (let i = p.bullets.length - 1; i >= 0; i--) {
                        const b = p.bullets[i];
                        b.x += b.dx;
                        b.y += b.dy;

                        for (const zid in zombies) {
                            const z = zombies[zid];
                            const dx = b.x - z.x;
                            const dy = b.y - z.y;
                            const dist2 = dx * dx + dy * dy;

                            if (dist2 < 20 * 20) {
                                this.zombieManager.updateZombie(roomId, zid, { hp: z.hp - 10 });

                                if (z.hp - 10 <= 0) {
                                    this.zombieManager.removeZombie(roomId, zid);
                                }

                                p.bullets.splice(i, 1);
                                break;
                            }
                        }
                    }
                }

                // 🔥 Broadcast state (players + zombies)
                const state = {
                    type: "state",
                    players,
                    zombies,
                    bullets,
                    serverTime: Date.now(),
                };
                this.roomManager.broadcastToRoom(roomId, state);
            }
        }, 50);

        logInfo("NetworkEngine started");
    }

    broadcastRoomsList() {
        const rooms = this.roomManager.getRooms();
        for (const client of this.wss.clients) {
            this.roomManager.sendTo(client as ExtWebSocket, {
                type: "roomsList",
                rooms,
            });
        }
    }
}