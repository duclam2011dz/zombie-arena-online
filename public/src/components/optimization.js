import { Interpolation } from '../utils/interpolation.js';

/**
 * Class Optimization giúp tối ưu hóa việc đồng bộ giữa client và server.
 */
export class Optimization {
    constructor(clientState, serverState, interpolationTime) {
        this.clientState = clientState;
        this.serverState = serverState;
        this.interpolationTime = interpolationTime;
    }

    /**
     * Thực hiện Interpolation giữa trạng thái client và server.
     * @returns {Object} Trạng thái đã được Interpolate.
     */
    applyInterpolation() {
        return Interpolation.interpolateObject(this.clientState, this.serverState, this.interpolationTime);
    }
}