// utils/interpolation.js
/**
 * Linear interpolation
 * @param {number} a
 * @param {number} b
 * @param {number} t - 0..1
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
/**
 * Find interpolated state from snapshot buffer
 * @param {Array} buffer - array of {x, y, angle, timestamp}
 * @param {number} renderTimestamp - target time (ms)
 * @returns {{x: number, y: number, angle: number} | null}
 */
export function interpolateSnapshot(buffer, renderTimestamp) {
    if (buffer.length < 2)
        return null;
    // Find two snapshots surrounding renderTimestamp
    for (let i = 0; i < buffer.length - 1; i++) {
        const older = buffer[i];
        const newer = buffer[i + 1];
        if (renderTimestamp >= older.timestamp && renderTimestamp <= newer.timestamp) {
            const t = (renderTimestamp - older.timestamp) / (newer.timestamp - older.timestamp);
            return {
                x: lerp(older.x, newer.x, t),
                y: lerp(older.y, newer.y, t),
                angle: lerpAngle(older.angle, newer.angle, t)
            };
        }
    }
    return null; // not enough snapshots to interpolate
}
/**
 * Interpolate angles correctly (avoid snapping at 2π boundary)
 */
export function lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff < -Math.PI)
        diff += Math.PI * 2;
    while (diff > Math.PI)
        diff -= Math.PI * 2;
    return a + diff * t;
}
//# sourceMappingURL=interpolation.js.map