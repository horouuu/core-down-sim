import "./App.css";
import { CoreHpCalculator } from "./components/core-hp";
import { Checkbox, NumberInputBox } from "./components/input-box";
import { WeaponSelection } from "./components/weapon-selection";
import { useState } from "react";
import { getMaxHitToa, getSpecMaxHitToa } from "./utils/calcs";
import type { Item } from "./utils/items";

type Stats = {
  strengthLevel: number;
  strengthBonus: number;
  raidLevel: number;
  teamSize: 1;
  salted: boolean;
  avernic: boolean;
};

export type HpState = {
  weapon: Item;
  weaponTicks: number;
  dmg: number;
  spec: boolean;
  id: number;
};

function getCoreMaxHp(raidLevel: number, teamSize: number) {
  const rawHp =
    4500 * (1 + Math.floor(raidLevel / 10) * 0.01) * (1 + 0.9 * (teamSize - 1));

  return Math.round(rawHp / 10) * 10;
}

function App() {
  const [stats, setStats] = useState<Stats>({
    strengthLevel: 99,
    strengthBonus: 66,
    raidLevel: 500,
    teamSize: 1,
    salted: true,
    avernic: true,
  });

  const [hpState, setHpState] = useState<HpState[]>([]);
  const [subQueue, setSubQueue] = useState<[number, number][]>([]);
  const [currentId, setCurrentId] = useState<number>(0);

  const handleStatsChange = (name: string, value: number | boolean) => {
    const newStats = { ...stats, [name]: value };
    setStats(newStats);
    if (
      name === "strengthLevel" ||
      name === "strengthBonus" ||
      name === "teamSize"
    ) {
      setHpState(
        hpState.map((step) => ({
          ...step,
          dmg: step.spec
            ? getSpecMaxHitToa(
                step.weapon,
                newStats.strengthLevel,
                newStats.strengthBonus
              ) * newStats.teamSize
            : getMaxHitToa(
                step.weapon,
                newStats.strengthLevel,
                newStats.strengthBonus
              ) * newStats.teamSize,
        }))
      );
    }
  };

  const handleAddAttack = ({
    weapon,
    weaponTicks,
    dmg,
    spec,
  }: Omit<HpState, "id">) => {
    const newStep = {
      weapon,
      weaponTicks,
      dmg: dmg * stats.teamSize,
      spec,
    };
    if (subQueue.length > 0) {
      const first = subQueue[0][0];
      setHpState((prev) =>
        prev.map((step) =>
          step.id === first ? { ...newStep, id: first } : step
        )
      );

      setSubQueue(subQueue.slice(1));
    } else {
      setHpState([...hpState, { ...newStep, id: currentId }]);
      setCurrentId((prev) => prev + 1);
    }
  };

  const handleSubstituteStep = (id: number, idx: number) => {
    if (!hpState.find((step) => step.id === id)) return;
    setHpState((prev) =>
      prev.map((step) => (step.id === id ? { ...step, dmg: -5 } : step))
    );

    setSubQueue((prev) =>
      [...prev, [id, idx] as [number, number]].sort((a, b) => a[1] - b[1])
    );
  };

  const handleReorder = (newHpState: HpState[]) => {
    setHpState(newHpState);
    setSubQueue(
      newHpState.flatMap((step, i) => (step.dmg < 0 ? [[step.id, i]] : []))
    );
  };

  const handleRemoveStep = (id: number) => {
    setHpState((prev) => prev.filter((i) => i.id !== id));
    setSubQueue((prev) => prev.filter((i) => i[0] !== id));
  };

  return (
    <>
      <h1 id="title">core down simulator</h1>
      <div id="container">
        <div id="content">
          <div id="inputs">
            <NumberInputBox
              label="Strength level"
              name="strengthLevel"
              defaultValue={99}
              onChange={handleStatsChange}
              min={1}
              max={99}
            />
            <NumberInputBox
              label="Strength bonus"
              name="strengthBonus"
              defaultValue={66}
              onChange={handleStatsChange}
              min={0}
            />
            <NumberInputBox
              label="Raid level"
              name="raidLevel"
              defaultValue={500}
              onChange={handleStatsChange}
              min={0}
              max={600}
            />
            <NumberInputBox
              label="Team size"
              name="teamSize"
              defaultValue={1}
              onChange={handleStatsChange}
              min={1}
              max={8}
            />
            <Checkbox
              label="Avernic"
              name="avernic"
              defaultChecked={true}
              onChange={handleStatsChange}
            />
          </div>
          <WeaponSelection
            weapons={[
              "bandos god",
              "*bandos god",
              "dragon dagg",
              "*dragon dagg",
              "dragon claws",
              "*dragon claws",
              "burning claws",
              "*burning claws",
              "fang",
              "*fang",
              "ghrazi",
              "keris partisan",
              "tentacle",
              "voidwaker",
              "elder maul",
            ]}
            onClick={handleAddAttack}
            stats={stats}
          />
          <button
            id="button"
            onClick={() => {
              setHpState([]);
              setSubQueue([]);
            }}
            style={{ alignSelf: "center" }}
          >
            Clear!
          </button>
        </div>
        <CoreHpCalculator
          maxHp={Math.max(4500, getCoreMaxHp(stats.raidLevel, stats.teamSize))}
          hpState={hpState}
          onRemoveStep={handleRemoveStep}
          onSubstituteStep={handleSubstituteStep}
          onReorder={handleReorder}
        />
      </div>
    </>
  );
}

export default App;
