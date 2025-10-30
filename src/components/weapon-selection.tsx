import styles from "./weapon-selection.module.css";
import { Weapons, type Item } from "../utils/items";

type WeaponSelectionProps = {
  weapons: string[];
  onClick: ({ weapon, spec }: { weapon: Item; spec: boolean }) => void;
};

export function WeaponSelection({ weapons, onClick }: WeaponSelectionProps) {
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
          <div className={styles.buttonContainer}>
            <button
              key={i}
              className={spec ? styles.specWepButton : styles.normalWepButton}
              onClick={() => onClick({ weapon: weapon[1], spec })}
            >
              <img
                src={`https://raw.githubusercontent.com/0xNeffarion/osrsreboxed-db/master/docs/items-icons/${weapon[1].id}.png`}
              />
            </button>
            30
          </div>,
        ];
      })}
    </div>
  );
}
