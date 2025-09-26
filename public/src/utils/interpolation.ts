// utils/interpolation.ts

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export interface Snapshot {
    x: number;
    y: number;
    angle: number;
    timestamp: number;
}

/**
 * Find interpolated state from snapshot buffer
 * @param buffer - array of snapshots
 * @param renderTimestamp - target time (ms)
 * @returns interpolated snapshot or null
 */
export function interpolateSnapshot(
    buffer: Snapshot[],
    renderTimestamp: number
): { x: number; y: number; angle: number } | null {
    if (buffer.length < 2) return null;

    for (let i = 0; i < buffer.length - 1; i++) {
        const older = buffer[i];
        const newer = buffer[i + 1];

        if (renderTimestamp >= older.timestamp && renderTimestamp <= newer.timestamp) {
            const t = (renderTimestamp - older.timestamp) / (newer.timestamp - older.timestamp);
            return {
                x: lerp(older.x, newer.x, t),
                y: lerp(older.y, newer.y, t),
                angle: lerpAngle(older.angle, newer.angle, t),
            };
        }
    }

    return null;
}

/**
 * Interpolate angles correctly (avoid snapping at 2π boundary)
 */
export function lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    return a + diff * t;
}