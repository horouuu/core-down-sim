import data from "../assets/item_data.json";

type StanceData = {
  combat_style: string;
  attack_type: string;
  attack_style: string;
  experience: string;
  boosts: string | null;
};
type WeaponSlot = "weapon" | "shield" | "2h";
interface WeaponStats {
  attack_speed: number;
  stances: StanceData[];
}

interface EquipmentStats {
  attack_stab: number;
  attack_slash: number;
  attack_crush: number;
  attack_magic: number;
  attack_ranged: number;
  defence_stab: number;
  defence_slash: number;
  defence_crush: number;
  defence_magic: number;
  defence_ranged: number;
  melee_strength: number;
  ranged_strength: number;
  magic_damage: number;
  prayer: number;
  slot: WeaponSlot;
  requirements: {
    attack: number;
    magic: number;
  };
}

export interface Item {
  id: number;
  name: string;
  equipment: EquipmentStats;
  weapon: WeaponStats | null;
}

function isWeapon(obj: unknown): obj is Item {
  if (typeof obj !== "object" || obj === null) return false;
  const data = obj as Record<string, unknown>;
  if (!("equipment" in data)) return false;
  if (typeof data.equipment !== "object" || data.equipment === null)
    return false;

  const hasWeapon =
    "weapon" in data && (data as { weapon?: unknown }).weapon !== null;

  return hasWeapon;
}
export const Weapons = Object.fromEntries(
  Object.entries(data).filter((i) => isWeapon(i[1]))
) as Record<string, Item>;
