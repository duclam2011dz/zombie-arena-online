export function sendJSON(ws, data) {
    if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

export function broadcastJSON(wss, data, excludeId = null) {
    const msg = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN && client.id !== excludeId) {
            client.send(msg);
        }
    });
}