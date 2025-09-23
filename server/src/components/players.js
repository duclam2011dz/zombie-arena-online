const players = {};

export function addPlayer(id) {
    players[id] = { x: 100, y: 100, angle: 0 };
    return players[id];
}

export function updatePlayer(id, x, y, angle) {
    if (players[id]) {
        players[id] = { x, y, angle };
    }
}

export function removePlayer(id) {
    delete players[id];
}

export function getPlayers() {
    return players;
}