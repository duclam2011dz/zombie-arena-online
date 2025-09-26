// server/src/core/RoomManager.js
import { sendJSON, broadcastJSON } from "../utils/wsWrapper.js";

export class RoomManager {
    constructor() {
        this.rooms = new Map();
        // Map<roomId, { players: Map<id, {x,y,angle,nickname}>, sockets: Set<ws>, maxPlayers: number }>
    }

    createRoom(roomId, maxPlayers = 10) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, { players: new Map(), sockets: new Set(), maxPlayers });
        }
        return this.rooms.get(roomId);
    }

    joinRoom(roomId, playerId, ws, nickname = "Anonymous") {
        const room = this.createRoom(roomId);
        if (room.players.size >= room.maxPlayers) {
            return null; // full
        }
        room.players.set(playerId, { x: 100, y: 100, angle: 0, nickname });
        room.sockets.add(ws);
        ws.roomId = roomId;
        return room.players.get(playerId);
    }

    leaveRoom(roomId, playerId, ws) {
        const room = this.rooms.get(roomId);
        if (!room) return;
        room.players.delete(playerId);
        room.sockets.delete(ws);

        if (room.players.size === 0) {
            this.rooms.delete(roomId); // auto delete empty room
        }
    }

    updatePlayer(roomId, playerId, x, y, angle) {
        const room = this.rooms.get(roomId);
        if (room && room.players.has(playerId)) {
            const prev = room.players.get(playerId);
            room.players.set(playerId, { ...prev, x, y, angle });
        }
    }

    getPlayers(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return {};
        // convert Map → plain object
        const playersObj = {};
        for (const [id, state] of room.players) {
            playersObj[id] = state;
        }
        return playersObj;
    }

    getRooms() {
        const result = {};
        for (const [roomId, room] of this.rooms) {
            result[roomId] = {
                playersCount: room.players.size,
                maxPlayers: room.maxPlayers,
            };
        }
        return result;
    }

    broadcastToRoom(roomId, data, excludeId = null) {
        const room = this.rooms.get(roomId);
        if (!room) return;
        broadcastJSON(room.sockets, data, excludeId);
    }

    sendTo(ws, data) {
        sendJSON(ws, data);
    }
}