import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { addPlayer, updatePlayer, removePlayer, getPlayers } from "../components/players.js";
import { sendJSON, broadcastJSON } from "../utils/wsWrapper.js";
import { logInfo, logSuccess, logWarn } from "../utils/logging.js";

export class NetworkEngine {
    constructor(server) {
        this.wss = new WebSocketServer({ server });

        this.wss.on("connection", (ws) => {
            const id = uuidv4();
            ws.id = id;

            logSuccess(`Client ${id} connected`);
            addPlayer(id);

            sendJSON(ws, { type: "init", id });

            ws.on("message", (msg) => {
                const data = JSON.parse(msg.toString());

                if (data.type === "ping") {
                    // phản hồi ngay để đo latency
                    sendJSON(ws, { type: "pong", clientTime: data.clientTime, serverTime: Date.now() });
                    return;
                }

                if (data.type === "playerMove") {
                    updatePlayer(ws.id, data.x, data.y, data.angle);

                    // broadcast cho các client khác kèm serverTime
                    broadcastJSON(this.wss, {
                        type: "playerMove",
                        id: ws.id,
                        x: data.x,
                        y: data.y,
                        angle: data.angle,
                        serverTime: Date.now()
                    }, ws.id);
                }

                if (data.type === "playerShoot") {
                    broadcastJSON(this.wss, {
                        ...data,
                        serverTime: Date.now()
                    }, ws.id);
                }
            });

            ws.on("close", () => {
                logWarn(`Client ${id} disconnected`);
                removePlayer(ws.id);
                broadcastJSON(this.wss, { type: "playerDisconnect", id });
            });
        });

        // Định kỳ sync state cho tất cả client
        setInterval(() => {
            const state = { type: "state", players: getPlayers(), serverTime: Date.now() };
            broadcastJSON(this.wss, state);
        }, 50);

        logInfo("NetworkEngine started");
    }
}