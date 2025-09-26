// server/src/components/players.js
// giữ lại API wrapper để không phải sửa quá nhiều ở NetworkEngine
// nhưng thực chất toàn bộ logic đi qua RoomManager

let roomManagerInstance = null;

export function setRoomManager(rm) {
    roomManagerInstance = rm;
}

export function addPlayer(roomId, playerId, ws) {
    return roomManagerInstance.joinRoom(roomId, playerId, ws);
}

export function updatePlayer(roomId, playerId, x, y, angle) {
    roomManagerInstance.updatePlayer(roomId, playerId, x, y, angle);
}

export function removePlayer(roomId, playerId, ws) {
    roomManagerInstance.leaveRoom(roomId, playerId, ws);
}

export function getPlayers(roomId) {
    return roomManagerInstance.getPlayers(roomId);
}