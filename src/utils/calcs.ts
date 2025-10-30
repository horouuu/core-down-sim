import type { Item } from "./items";

export function getMaxHitToa(
  weapon: Item,
  strLvl: number,
  equipmentStr: number
) {
  const saltBonus = 11 + Math.floor(0.16 * strLvl);
  const effStr = Math.floor((strLvl + saltBonus) * 1.23) + 3 + 8;
  const maxHit = Math.floor(
    (effStr * (weapon.equipment.melee_strength + equipmentStr + 64) + 320) / 640
  );

  return maxHit;
}
