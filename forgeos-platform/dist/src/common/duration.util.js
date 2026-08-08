"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDurationToMs = parseDurationToMs;
const UNIT_MS = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
};
function parseDurationToMs(duration) {
    const match = /^(\d+)(ms|s|m|h|d)?$/.exec(duration.trim());
    if (!match) {
        throw new Error(`Invalid duration string: "${duration}"`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2] ?? 's';
    return value * UNIT_MS[unit];
}
//# sourceMappingURL=duration.util.js.map