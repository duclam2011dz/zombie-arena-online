export class Interpolation {
    /**
     * Tính toán Interpolation cho 2 giá trị
     * @param {number} start Giá trị ban đầu
     * @param {number} end Giá trị kết thúc
     * @param {number} t Thời gian (từ 0 đến 1)
     * @returns {number} Giá trị đã được Interpolate
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    /**
     * Tính toán Interpolation cho đối tượng (player, bullet, v.v.)
     * @param {Object} startState Trạng thái ban đầu của đối tượng
     * @param {Object} endState Trạng thái kết thúc của đối tượng
     * @param {number} t Thời gian interpolation (từ 0 đến 1)
     * @returns {Object} Trạng thái mới đã được Interpolate
     */
    static interpolateObject(startState, endState, t) {
        return {
            x: this.lerp(startState.x, endState.x, t),
            y: this.lerp(startState.y, endState.y, t),
            angle: this.lerp(startState.angle, endState.angle, t),
        };
    }
}