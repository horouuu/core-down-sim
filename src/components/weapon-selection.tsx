import styles from "./weapon-selection.module.css";
import { Weapons, type Item } from "../utils/items";
import { getMaxHitToa } from "../utils/calcs";

type WeaponSelectionProps = {
  weapons: string[];
  onClick: ({ weapon, spec }: { weapon: Item; spec: boolean }) => void;
  stats: { strengthLevel: number; strengthBonus: number };
};

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
        return [
          <div className={styles.buttonContainer} key={i}>
            <button
              className={spec ? styles.specWepButton : styles.normalWepButton}
              onClick={() => onClick({ weapon: weapon[1], spec })}
            >
              <img
                src={`https://raw.githubusercontent.com/0xNeffarion/osrsreboxed-db/master/docs/items-icons/${weapon[1].id}.png`}
              />
            </button>
            {getMaxHitToa(weapon[1], stats.strengthLevel, stats.strengthBonus)}
          </div>,
        ];
      })}
    </div>
  );
}
