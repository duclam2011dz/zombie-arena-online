import { ZombieManager, ZombieState } from "../core/ZombieManager.js";

let zombieManagerInstance: ZombieManager | null = null;

export function setZombieManager(zm: ZombieManager): void {
    zombieManagerInstance = zm;
}

export function spawnZombie(roomId: string, zombie: ZombieState): void {
    if (!zombieManagerInstance) throw new Error("ZombieManager not set");
    zombieManagerInstance.spawnZombie(roomId, zombie);
}

export function removeZombie(roomId: string, zombieId: string): void {
    if (!zombieManagerInstance) throw new Error("ZombieManager not set");
    zombieManagerInstance.removeZombie(roomId, zombieId);
}

export function getZombies(roomId: string): Record<string, ZombieState> {
    if (!zombieManagerInstance) throw new Error("ZombieManager not set");
    return zombieManagerInstance.getZombies(roomId);
}

export function updateZombie(roomId: string, zombieId: string, partial: Partial<ZombieState>): void {
    if (!zombieManagerInstance) throw new Error("ZombieManager not set");
    zombieManagerInstance.updateZombie(roomId, zombieId, partial);
}