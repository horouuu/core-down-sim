import styles from "./weapon-selection.module.css";
import { Weapons, type Item } from "../utils/items";
import { getMaxHitToa, getSpecMaxHitToa } from "../utils/calcs";

type WeaponSelectionProps = {
  weapons: string[];
  onClick: ({
    weapon,
    weaponTicks,
    dmg,
    spec,
  }: {
    weapon: Item;
    weaponTicks: number;
    dmg: number;
    spec: boolean;
  }) => void;
  stats: { strengthLevel: number; strengthBonus: number };
};

const ICONS_URL = `https://cdn.jsdelivr.net/gh/0xNeffarion/osrsreboxed-db@37322fed3abb2d58236c59dfc6babb37a27a50ea/docs/items-icons/`;

export function WeaponSelection({
  weapons,
  onClick,
  stats,
}: WeaponSelectionProps) {
  const weaponEntries = Object.entries(Weapons);
  return (
    <div className={styles.grid}>
      {weapons.flatMap((w, i) => {
        const wName = w.replace("*", "");
        const spec = w.includes("*");
        const weapon = weaponEntries.find((e) =>
          e[1].name.toLowerCase().includes(wName)
        );
        if (!weapon) return [];

        const wepData = weapon[1].weapon;
        if (!wepData) return [];

        const dmg = spec
          ? getSpecMaxHitToa(
              weapon[1],
              stats.strengthLevel,
              stats.strengthBonus
            )
          : getMaxHitToa(weapon[1], stats.strengthLevel, stats.strengthBonus);

        return [
          <div className={styles.buttonContainer} key={i}>
            <button
              className={spec ? styles.specWepButton : styles.normalWepButton}
              onClick={() =>
                onClick({
                  weapon: weapon[1],
                  weaponTicks: wepData.attack_speed,
                  dmg,
                  spec,
                })
              }
            >
              <img src={`${ICONS_URL}/${weapon[1].id}.png`} />
            </button>
            {dmg}
          </div>,
        ];
      })}
    </div>
  );
}
