import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { RoomManager } from "./RoomManager.js";
import { logInfo, logSuccess, logWarn } from "../utils/logging.js";

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

    constructor(server: any) {
        this.wss = new WebSocketServer({ server });
        this.roomManager = new RoomManager();
        (global as any).roomManager = this.roomManager;

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
                    this.roomManager.broadcastToRoom(
                        ws.roomId!,
                        {
                            ...data,
                            nickname: player.nickname,
                            serverTime: Date.now(),
                        },
                        id
                    );
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
                const state = {
                    type: "state",
                    players: this.roomManager.getPlayers(roomId),
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