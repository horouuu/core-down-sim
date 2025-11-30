import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HpState } from "../App";
import styles from "./core-hp.module.css";

const ICONS_URL = `https://cdn.jsdelivr.net/gh/0xNeffarion/osrsreboxed-db@37322fed3abb2d58236c59dfc6babb37a27a50ea/docs/items-icons/`;

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
  hpState: (HpState & { id: number })[],
  maxHp: number,
  onRemoveStep: (i: number) => void,
  onSubstituteStep: (i: number, idx: number) => void
) => {
  const reduced = hpState.reduce<[number, number][]>((acc, stateData) => {
    const last = acc.at(-1) ?? [maxHp, 1];
    const currHp = last[0] - stateData.dmg * 5;
    acc.push([currHp, stateData.weaponTicks]);
    return acc;
  }, []);

  let coreState = 1;
  let coreNum = 1;
  let currCoreIdx = 0;
  let ticks = getCoreTime(coreState);
  let prev: [number, number] | null = null;
  const final = reduced.flatMap((step, idx) => {
    const id = hpState[idx].id;
    const props = {
      id,
      idx,
      coreIdx: currCoreIdx,
      currentHp: step[0],
      onRemoveStep,
      onSubstituteStep,
      maxHp,
      stateData: {
        dmg: hpState[idx].dmg,
        weaponId: hpState[idx].weapon.id,
      },
    };

    const hpBar = <HpBar key={id} {...props} />;
    const getCoreLabel = (c: number) => <label>Core {c}</label>;

    if (ticks <= 0) {
      const lastHp = prev ? prev[0] : 0;
      coreState = getCoreState(lastHp / maxHp);
      ticks = getCoreTime(coreState) - step[1];
      coreNum += 1;
      props.coreIdx = 0;
      currCoreIdx = 0;
      currCoreIdx = 1;
      prev = step;
      return [getCoreLabel(coreNum), hpBar];
    } else {
      ticks -= step[1];
      currCoreIdx += 1;
      prev = step;
      return idx === 0 ? [getCoreLabel(1), hpBar] : [hpBar];
    }
  });

  return final;
};

type HpBarProps = {
  id: number;
  idx: number;
  coreIdx: number;
  currentHp: number;
  maxHp: number;
  stateData: { weaponId: number; dmg: number };
  onRemoveStep: (id: number) => void;
  onSubstituteStep: (id: number, idx: number) => void;
};

function HpBar({
  id,
  idx,
  coreIdx,
  currentHp,
  maxHp,
  stateData,
  onRemoveStep,
  onSubstituteStep,
}: HpBarProps) {
  const { weaponId, dmg } = stateData;
  const subbed = dmg < 0;
  const percentage = Math.max(0, Math.min(1, currentHp / maxHp || 0));
  const pText = `${Math.floor(percentage * 100)}%`;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent, id: number, idx: number) => {
    if (e.target === e.currentTarget) return;
    if (e.shiftKey && !subbed) {
      onSubstituteStep(id, idx);
    } else {
      onRemoveStep(id);
    }
  };

  return (
    <div
      className={styles.barContainer}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClick(e, id, idx)}
    >
      {subbed ? (
        <div className={styles.subbedBox}>?</div>
      ) : (
        <>
          <img className={styles.img} src={`${ICONS_URL}/${weaponId}.png`} />
          <div className={styles.dmgBox}>{dmg * 5}</div>
        </>
      )}
      <button
        className={styles.bar}
        style={{ ["--pct" as string]: percentage }}
      >
        <div
          className={subbed ? styles.fillSubbed : styles.fill}
          style={{ ["--pct" as string]: percentage }}
        />
        <label className={styles.label}>
          {subbed ? "?" : `${currentHp}/${maxHp} [${pText}]`}
        </label>
        <label className={styles.numberLabel}>{coreIdx + 1}</label>
      </button>
    </div>
  );
}

type CoreHpCalculatorProps = {
  hpState: HpState[];
  maxHp: number;
  onRemoveStep: (id: number) => void;
  onSubstituteStep: (i: number, idx: number) => void;
  onReorder: (h: HpState[]) => void;
};

export function CoreHpCalculator({
  hpState,
  maxHp,
  onRemoveStep,
  onSubstituteStep,
  onReorder,
}: CoreHpCalculatorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !active) return;
    if (active.id !== over.id) {
      const oldIndex = hpState.findIndex((i) => i.id === active.id);
      const newIndex = hpState.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const n = arrayMove(hpState, oldIndex, newIndex);
      onReorder(n);
    }
  }

  return (
    <div className={styles.coreContainer}>
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext strategy={verticalListSortingStrategy} items={hpState}>
          {processStates(hpState, maxHp, onRemoveStep, onSubstituteStep)}
        </SortableContext>
      </DndContext>
    </div>
  );
}
