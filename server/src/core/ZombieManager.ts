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
                this.spawnZombie(roomId, {
                    id: `z_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    hp: 100,
                });
            }
        }, 5000);
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