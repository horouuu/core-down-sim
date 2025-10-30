import type { HpStateStack } from "../App";
import styles from "./core-hp.module.css";

const ICONS_URL = `https://cdn.jsdelivr.net/gh/0xNeffarion/osrsreboxed-db@37322fed3abb2d58236c59dfc6babb37a27a50ea/docs/items-icons/`;

type HpBarProps = {
  current: number;
  max: number;
  stateData: { weaponId: number; dmg: number };
  onRemoveStep: (i: number) => void;
  onSubstituteStep: (i: number) => void;
  idx: number;
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

const processStates = (
  hpState: HpStateStack,
  maxHp: number,
  onRemoveStep: (i: number) => void,
  onSubstituteStep: (i: number) => void
) => {
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
        key={i}
        idx={i}
        current={step[0]}
        onRemoveStep={onRemoveStep}
        onSubstituteStep={onSubstituteStep}
        max={maxHp}
        stateData={{
          dmg: hpState[i].dmg,
          weaponId: hpState[i].weapon.id,
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
};

function HpBar({
  current,
  max,
  stateData,
  onRemoveStep,
  onSubstituteStep,
  idx,
}: HpBarProps) {
  const { weaponId, dmg } = stateData;
  const subbed = dmg < 0;
  const percentage = Math.max(0, Math.min(1, current / max || 0));
  const pText = `${Math.floor(percentage * 100)}%`;

  const handleClick = (e: React.MouseEvent, idx: number) => {
    if (e.shiftKey && !subbed) {
      onSubstituteStep(idx);
    } else {
      onRemoveStep(idx);
    }
  };

  return (
    <div className={styles.barContainer}>
      {subbed ? (
        <div className={styles.subbedBox}>?</div>
      ) : (
        <>
          <img
            className={styles.img}
            src={`${ICONS_URL}/${weaponId}.png`}
            onClick={(e: React.MouseEvent<HTMLImageElement>) =>
              handleClick(e, idx)
            }
          />
          <div
            className={styles.dmgBox}
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              handleClick(e, idx)
            }
          >
            {dmg * 5}
          </div>
        </>
      )}
      <button
        className={styles.bar}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          handleClick(e, idx)
        }
        style={{ ["--pct" as string]: percentage }}
      >
        <div
          className={subbed ? styles.fillSubbed : styles.fill}
          style={{ ["--pct" as string]: percentage }}
        />
        <label className={styles.label}>
          {subbed ? "?" : `${current}/${max} [${pText}]`}
        </label>
      </button>
    </div>
  );
}

type CoreHpCalculatorProps = {
  hpState: HpStateStack;
  maxHp: number;
  onRemoveStep: (i: number) => void;
  onSubstituteStep: (i: number) => void;
};

export function CoreHpCalculator({
  hpState,
  maxHp,
  onRemoveStep,
  onSubstituteStep,
}: CoreHpCalculatorProps) {
  return (
    <div className={styles.coreContainer}>
      {processStates(hpState, maxHp, onRemoveStep, onSubstituteStep)}
    </div>
  );
}
