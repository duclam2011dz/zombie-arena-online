import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { RoomManager } from "./RoomManager.js";
import { logInfo, logSuccess, logWarn } from "../utils/logging.js";

export class NetworkEngine {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.roomManager = new RoomManager();
        global.roomManager = this.roomManager;

        this.wss.on("connection", (ws) => {
            const id = uuidv4();
            ws.id = id;

            logSuccess(`Client ${id} connected`);

            // Step 1: client sẽ gửi init kèm roomId
            ws.on("message", (msg) => {
                const data = JSON.parse(msg.toString());

                if (data.type === "requestRooms") {
                    this.roomManager.sendTo(ws, { type: "roomsList", rooms: this.roomManager.getRooms() });
                    return;
                }

                if (data.type === "createRoom") {
                    this.roomManager.createRoom(data.roomId, data.maxPlayers || 10);
                    // broadcast rooms update
                    this.broadcastRoomsList();
                    return;
                }

                if (data.type === "joinRoom") {
                    const player = this.roomManager.joinRoom(data.roomId, id, ws, data.nickname);
                    if (!player) {
                        this.roomManager.sendTo(ws, { type: "error", message: "Room full or not exist" });
                        return;
                    }
                    this.roomManager.sendTo(ws, { type: "init", id, roomId: data.roomId });
                    this.broadcastRoomsList();
                    return;
                }

                if (data.type === "ping") {
                    this.roomManager.sendTo(ws, { type: "pong", clientTime: data.clientTime, serverTime: Date.now() });
                    return;
                }

                if (data.type === "playerMove") {
                    const player = this.roomManager.getPlayers(ws.roomId)[id];
                    this.roomManager.updatePlayer(ws.roomId, id, data.x, data.y, data.angle);

                    // broadcast cho các client khác kèm serverTime
                    this.roomManager.broadcastToRoom(ws.roomId, {
                        type: "playerMove",
                        id,
                        x: data.x,
                        y: data.y,
                        angle: data.angle,
                        nickname: player.nickname,
                        serverTime: Date.now()
                    }, id);
                }

                if (data.type === "playerShoot") {
                    const player = this.roomManager.getPlayers(ws.roomId)[id];
                    this.roomManager.broadcastToRoom(ws.roomId, {
                        ...data,
                        nickname: player.nickname,
                        serverTime: Date.now()
                    }, id);
                }
            });

            ws.on("close", () => {
                logWarn(`Client ${id} disconnected`);
                if (ws.roomId) {
                    this.roomManager.leaveRoom(ws.roomId, id, ws);
                    this.roomManager.broadcastToRoom(ws.roomId, { type: "playerDisconnect", id });
                    this.broadcastRoomsList();
                }
            });
        });

        // Sync state từng room
        setInterval(() => {
            for (const [roomId] of this.roomManager.rooms) {
                const state = {
                    type: "state",
                    players: this.roomManager.getPlayers(roomId),
                    serverTime: Date.now()
                };
                this.roomManager.broadcastToRoom(roomId, state);
            }
        }, 50);

        logInfo("NetworkEngine started");
    }

    broadcastRoomsList() {
        const rooms = this.roomManager.getRooms();
        for (const client of this.wss.clients) {
            this.roomManager.sendTo(client, { type: "roomsList", rooms });
        }
    }
}