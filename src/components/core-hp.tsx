import type { HpStateStack } from "../App";
import styles from "./core-hp.module.css";

type HpBarProps = {
  current: number;
  max: number;
};

function addThreshold(ticks: number, core: number) {
  if (core === 1) {
    return ticks - 21 > 0 ? 1 : 0;
  } else if (core === 2) {
    return ticks - 29 > 0 ? 1 : 0;
  } else if (core >= 3) {
    return ticks - 37 > 0 ? 1 : 0;
  } else {
    return 0;
  }
}

function HpBar({ current, max }: HpBarProps) {
  const percentage = Math.max(0, Math.min(1, current / max || 0));
  const pText = `${Math.floor(percentage * 100)}%`;

  return (
    <button className={styles.bar} style={{ ["--pct" as string]: percentage }}>
      <div
        className={styles.fill}
        style={{ ["--pct" as string]: percentage }}
      />
      <label className={styles.label}>
        {current}/{max} [{pText}]
      </label>
    </button>
  );
}

type CoreHpCalculatorProps = {
  hpState: HpStateStack;
  maxHp: number;
};

export function CoreHpCalculator({ hpState, maxHp }: CoreHpCalculatorProps) {
  return (
    <div className={styles.coreContainer}>
      {hpState
        .reduce<[number, number, number, number][]>((acc, stateData) => {
          const last = acc.at(-1) ?? [maxHp, 1, 0, 1];
          const currentTicks = last[1] + last[2];
          const threshChange = addThreshold(currentTicks, last[3]);
          acc.push([
            last[0] - stateData.dmg * 5, // dmg
            threshChange === 1 ? 1 : currentTicks, // current tick; reset to 0 if threshold has changed
            stateData.weaponTicks, // ticks spent,
            last[3] + threshChange, // core number
          ]);
          return acc;
        }, [])
        .flatMap((states, i, arr) => {
          if (i == 0 || (i > 0 && states[3] !== arr[i - 1][3])) {
            return [
              <label>Core {states[3]}</label>,
              <HpBar current={states[0]} max={maxHp} />,
            ];
          } else {
            return [<HpBar current={states[0]} max={maxHp} />];
          }
        })}
    </div>
  );
}
