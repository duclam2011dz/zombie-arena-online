export function predictPosition(
    x: number,
    y: number,
    dx: number,
    dy: number,
    deltaTime: number
): { x: number; y: number } {
    return {
        x: x + dx * deltaTime,
        y: y + dy * deltaTime,
    };
}