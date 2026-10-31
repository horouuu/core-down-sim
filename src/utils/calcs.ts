import type { Item } from "./items";

type MaxHitInputs = {
  weapon: Item;
  strLvl: number;
  equipmentStr: number;
  avernic: boolean;
  ignoreFlags?: boolean;
  zeal: boolean;
};

export function getMaxHitToa(inps: MaxHitInputs) {
  const {
    weapon,
    strLvl,
    equipmentStr,
    avernic,
    ignoreFlags = false,
    zeal,
  } = inps;

  const prayBonus = zeal ? 1.28 : 1.23;

  const saltBonus = 11 + Math.floor(0.16 * strLvl);
  const twoHanded = weapon.equipment.slot === "2h";
  const defenderOffset = twoHanded ? (avernic ? 8 : 6) : 0;
  const effStr = Math.floor((strLvl + saltBonus) * prayBonus + 3 + 8);
  const totalEqStr =
    weapon.equipment.melee_strength + equipmentStr - defenderOffset;
  const maxHit = Math.floor((effStr * (totalEqStr + 64) + 320) / 640);

  if (weapon.id === 26219 && !ignoreFlags) return maxHit - Math.floor(maxHit * 0.15); // fang
  return maxHit;
}

export function getSpecMaxHitToa(inps: Omit<MaxHitInputs, "ignoreFlags">) {
  const { weapon } = inps;
  const maxHit = getMaxHitToa(inps);
  if (weapon.id === 11804) {
    // bgs
    const gsDmg = Math.floor(maxHit * 1.1);
    return Math.floor(gsDmg * 1.1);
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
    // bclaws
  } else if (weapon.id === 29577) {
    return Math.floor(maxHit * 1.75);
  } else if (weapon.id === 11806) {
    return Math.floor(maxHit * 1.1);
  } else if (weapon.id === 26219) {
    return Math.floor(getMaxHitToa({ ...inps, ignoreFlags: true }));
  }

  return maxHit;
}
