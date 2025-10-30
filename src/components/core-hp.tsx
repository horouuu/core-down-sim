import type { HpStateStack } from "../App";
import styles from "./core-hp.module.css";

const ICONS_URL = `https://cdn.jsdelivr.net/gh/0xNeffarion/osrsreboxed-db@37322fed3abb2d58236c59dfc6babb37a27a50ea/docs/items-icons/`;

type HpBarProps = {
  current: number;
  max: number;
  stateData: { weaponId: number; dmg: number };
};

function getCoreTime(coreState: number) {
  if (coreState === 1) {
    return 21;
  } else if (coreState === 2) {
    return 29;
  } else if (coreState >= 3) {
    return 37;
  } else {
    return 0;
  }
}

function getCoreState(hpPct: number) {
  if (hpPct >= 0.8) {
    return 1;
  } else if (hpPct >= 0.6) {
    return 2;
  } else if (hpPct < 0.6) {
    return 3;
  } else {
    return 1;
  }
}

function processStates(hpState: HpStateStack, maxHp: number) {
  const reduced = hpState.reduce<[number, number][]>((acc, stateData) => {
    const last = acc.at(-1) ?? [maxHp, 1, 0, 1];
    const currHp = last[0] - stateData.dmg * 5;
    acc.push([currHp, stateData.weaponTicks]);
    return acc;
  }, []);

  let coreState = 1;
  let coreNum = 1;
  let ticks = getCoreTime(coreState);
  const final = reduced.flatMap((step, i) => {
    const comp = (
      <HpBar
        current={step[0]}
        max={maxHp}
        stateData={{
          dmg: hpState[i].dmg,
          weaponId: hpState[i].weaponId,
        }}
      />
    );

    if (ticks <= 0) {
      coreState = getCoreState(step[0] / maxHp);
      ticks = getCoreTime(coreState) - step[1];
      coreNum += 1;
      return [<label>Core {coreNum}</label>, comp];
    } else if (i === 0) {
      ticks -= step[1];
      return [<label>Core {coreNum}</label>, comp];
    } else {
      ticks -= step[1];
      return [comp];
    }
  });

  return final;
}

function HpBar({ current, max, stateData }: HpBarProps) {
  const { weaponId, dmg } = stateData;
  const percentage = Math.max(0, Math.min(1, current / max || 0));
  const pText = `${Math.floor(percentage * 100)}%`;

  return (
    <div className={styles.barContainer}>
      <button
        className={styles.bar}
        style={{ ["--pct" as string]: percentage }}
      >
        <div
          className={styles.fill}
          style={{ ["--pct" as string]: percentage }}
        />
        <label className={styles.label}>
          {current}/{max} [{pText}]
        </label>
      </button>
      <div className={styles.dmgBox}>{dmg * 5}</div>
      <img className={styles.img} src={`${ICONS_URL}/${weaponId}.png`} />
    </div>
  );
}

type CoreHpCalculatorProps = {
  hpState: HpStateStack;
  maxHp: number;
};

export function CoreHpCalculator({ hpState, maxHp }: CoreHpCalculatorProps) {
  return (
    <div className={styles.coreContainer}>{processStates(hpState, maxHp)}</div>
  );
}
