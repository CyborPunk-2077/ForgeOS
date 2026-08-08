const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/**
 * Parses duration strings like '7d', '1h', '30m', '45s' (as accepted by
 * jsonwebtoken's expiresIn option) into milliseconds. A bare number string
 * is treated as seconds, matching jsonwebtoken's own convention.
 */
export function parseDurationToMs(duration: string): number {
  const match = /^(\d+)(ms|s|m|h|d)?$/.exec(duration.trim());
  if (!match) {
    throw new Error(`Invalid duration string: "${duration}"`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2] ?? 's';
  return value * UNIT_MS[unit];
}
