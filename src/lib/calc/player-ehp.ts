/**
 * wiki Shield (both wikis): Warframe, Operator, Archwing, Railjack and Necramech shields take
 * 50% less damage (not Companions). Armor does not apply to shields.
 */
export const PLAYER_SHIELD_DAMAGE_TAKEN = 0.5;

/** Player EHP: health ÷ (1 − DR) + shields ÷ 0.5. DR is a fraction (armor and other DR combined). */
export function playerEffectiveHealth(health: number, drFraction: number, shield: number): number {
  const dr = Math.min(Math.max(drFraction, 0), 0.999999);
  return health / (1 - dr) + shield / PLAYER_SHIELD_DAMAGE_TAKEN;
}
