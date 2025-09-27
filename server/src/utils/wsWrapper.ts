// server/src/utils/wsWrapper.js
import WebSocket from "ws";

export function sendJSON(ws: WebSocket & { id?: string }, data: unknown): void {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

export function broadcastJSON(
    sockets: Array<WebSocket & { id?: string }>,
    data: unknown,
    excludeId: string | null = null
): void {
    const msg = JSON.stringify(data);
    sockets.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.id !== excludeId) {
            client.send(msg);
        }
    });
}