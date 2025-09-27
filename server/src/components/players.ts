// server/src/components/players.js
// giữ lại API wrapper để không phải sửa quá nhiều ở NetworkEngine
// nhưng thực chất toàn bộ logic đi qua RoomManager

import WebSocket from "ws";
import { RoomManager, PlayerState } from "../core/RoomManager.js";

let roomManagerInstance: RoomManager | null = null;

export function setRoomManager(rm: RoomManager): void {
    roomManagerInstance = rm;
}

export function addPlayer(
    roomId: string,
    playerId: string,
    ws: WebSocket & { id?: string }
): PlayerState | null {
    if (!roomManagerInstance) throw new Error("RoomManager not set");
    return roomManagerInstance.joinRoom(roomId, playerId, ws);
}

export function updatePlayer(
    roomId: string,
    playerId: string,
    x: number,
    y: number,
    angle: number
): void {
    if (!roomManagerInstance) throw new Error("RoomManager not set");
    roomManagerInstance.updatePlayer(roomId, playerId, x, y, angle);
}

export function removePlayer(
    roomId: string,
    playerId: string,
    ws: WebSocket & { id?: string }
): void {
    if (!roomManagerInstance) throw new Error("RoomManager not set");
    roomManagerInstance.leaveRoom(roomId, playerId, ws);
}

export function getPlayers(roomId: string): Record<string, PlayerState> {
    if (!roomManagerInstance) throw new Error("RoomManager not set");
    return roomManagerInstance.getPlayers(roomId);
}