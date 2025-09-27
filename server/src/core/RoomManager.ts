// server/src/core/RoomManager.js
import WebSocket from "ws";
import { sendJSON, broadcastJSON } from "../utils/wsWrapper.js";

export interface PlayerState {
    x: number;
    y: number;
    angle: number;
    nickname: string;
}

export interface Room {
    players: Map<string, PlayerState>;
    sockets: Set<WebSocket & { id?: string; roomId?: string }>;
    maxPlayers: number;
}

export class RoomManager {
    public rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map();
    }

    createRoom(roomId: string, maxPlayers = 10): Room {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                players: new Map(),
                sockets: new Set(),
                maxPlayers,
            });
        }
        return this.rooms.get(roomId)!;
    }

    joinRoom(
        roomId: string,
        playerId: string,
        ws: WebSocket & { id?: string; roomId?: string },
        nickname = "Anonymous"
    ): PlayerState | null {
        const room = this.createRoom(roomId);
        if (room.players.size >= room.maxPlayers) {
            return null; // full
        }
        room.players.set(playerId, { x: 100, y: 100, angle: 0, nickname });
        room.sockets.add(ws);
        ws.roomId = roomId;
        return room.players.get(playerId)!;
    }

    leaveRoom(
        roomId: string,
        playerId: string,
        ws: WebSocket & { id?: string; roomId?: string }
    ): void {
        const room = this.rooms.get(roomId);
        if (!room) return;
        room.players.delete(playerId);
        room.sockets.delete(ws);

        if (room.players.size === 0) {
            this.rooms.delete(roomId); // auto delete empty room
        }
    }

    updatePlayer(roomId: string, playerId: string, x: number, y: number, angle: number): void {
        const room = this.rooms.get(roomId);
        if (room && room.players.has(playerId)) {
            const prev = room.players.get(playerId)!;
            room.players.set(playerId, { ...prev, x, y, angle });
        }
    }

    getPlayers(roomId: string): Record<string, PlayerState> {
        const room = this.rooms.get(roomId);
        if (!room) return {};
        const playersObj: Record<string, PlayerState> = {};
        for (const [id, state] of room.players) {
            playersObj[id] = state;
        }
        return playersObj;
    }

    getRooms(): Record<string, { playersCount: number; maxPlayers: number }> {
        const result: Record<string, { playersCount: number; maxPlayers: number }> = {};
        for (const [roomId, room] of this.rooms) {
            result[roomId] = {
                playersCount: room.players.size,
                maxPlayers: room.maxPlayers,
            };
        }
        return result;
    }

    broadcastToRoom(roomId: string, data: unknown, excludeId: string | null = null): void {
        const room = this.rooms.get(roomId);
        if (!room) return;
        broadcastJSON(room.sockets as any, data, excludeId);
    }

    sendTo(ws: WebSocket, data: unknown): void {
        sendJSON(ws, data);
    }
}