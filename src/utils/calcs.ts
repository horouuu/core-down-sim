import type { Item } from "./items";

export function getMaxHitToa(
  weapon: Item,
  strLvl: number,
  equipmentStr: number,
  avernic: boolean = true
) {
  const saltBonus = 11 + Math.floor(0.16 * strLvl);
  const twoHanded = weapon.equipment.slot === "2h";
  const defenderOffset = twoHanded ? (avernic ? 8 : 6) : 0;
  const effStr = Math.floor((strLvl + saltBonus) * 1.23) + 3 + 8;
  const maxHit = Math.floor(
    (effStr *
      (weapon.equipment.melee_strength + equipmentStr - defenderOffset + 64) +
      320) /
      640
  );

  if (weapon.id === 26219) return Math.floor(maxHit * 0.85); // fang
  return maxHit;
}

export function getSpecMaxHitToa(
  weapon: Item,
  strLvl: number,
  equipmentStr: number,
  avernic: boolean = true
) {
  const maxHit = getMaxHitToa(weapon, strLvl, equipmentStr, avernic);
  if (weapon.id === 26219) {
    // fang
    return Math.floor(maxHit / 0.85);
  } else if (weapon.id === 11804) {
    // bgs
    return Math.floor(maxHit * 1.21);
  } else if (weapon.id === 1215) {
    // dds
    return Math.floor(maxHit * 1.15) * 2;
  } else if (weapon.id === 13652) {
    // dclaws
    const firstHit = maxHit - 1;
    const secondHit = Math.floor(firstHit / 2);
    const thirdHit = Math.floor(secondHit / 2);
    const fourthHit = thirdHit + 1;
    return firstHit + secondHit + thirdHit + fourthHit;
  } else if (weapon.id === 29577) {
    return Math.floor(maxHit * 1.75);
  }

  return maxHit;
}
