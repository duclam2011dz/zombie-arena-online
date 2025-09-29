import { RoomManager } from "./RoomManager.js";

export interface ZombieState {
    id: string;
    x: number;
    y: number;
    hp: number;
}

export class ZombieManager {
    private roomManager: RoomManager;
    private zombies: Map<string, Map<string, ZombieState>>;

    constructor(roomManager: RoomManager) {
        this.roomManager = roomManager;
        this.zombies = new Map();

        // Spawn loop
        setInterval(() => {
            for (const [roomId] of this.roomManager.rooms) {
                const pos = this.randomSpawnPosition(2000, 2000);
                this.spawnZombie(roomId, {
                    id: `z_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    x: pos.x,
                    y: pos.y,
                    hp: 100,
                });
            }
        }, 5000);
    }

    private randomSpawnPosition(mapWidth: number, mapHeight: number): { x: number; y: number } {
        const side = Math.floor(Math.random() * 4); // 0=top,1=right,2=bottom,3=left
        const margin = 20;
        switch (side) {
            case 0: return { x: Math.random() * mapWidth, y: margin }; // top
            case 1: return { x: mapWidth - margin, y: Math.random() * mapHeight }; // right
            case 2: return { x: Math.random() * mapWidth, y: mapHeight - margin }; // bottom
            case 3: return { x: margin, y: Math.random() * mapHeight }; // left
            default: return { x: 0, y: 0 };
        }
    }

    spawnZombie(roomId: string, zombie: ZombieState): void {
        if (!this.zombies.has(roomId)) {
            this.zombies.set(roomId, new Map());
        }
        const roomZombies = this.zombies.get(roomId)!;
        roomZombies.set(zombie.id, zombie);
    }

    getZombies(roomId: string): Record<string, ZombieState> {
        const roomZombies = this.zombies.get(roomId);
        if (!roomZombies) return {};
        const result: Record<string, ZombieState> = {};
        for (const [id, state] of roomZombies) {
            result[id] = state;
        }
        return result;
    }

    removeZombie(roomId: string, zombieId: string): void {
        const roomZombies = this.zombies.get(roomId);
        if (!roomZombies) return;
        roomZombies.delete(zombieId);
    }

    updateZombie(roomId: string, zombieId: string, partial: Partial<ZombieState>): void {
        const roomZombies = this.zombies.get(roomId);
        if (!roomZombies || !roomZombies.has(zombieId)) return;
        const prev = roomZombies.get(zombieId)!;
        roomZombies.set(zombieId, { ...prev, ...partial });
    }
}