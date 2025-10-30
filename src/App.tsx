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

export type HpStateStack = {
  weapon: Item;
  weaponTicks: number;
  dmg: number;
  spec: boolean;
}[];

function App() {
  const [stats, setStats] = useState<Stats>({
    strengthLevel: 99,
    strengthBonus: 66,
    raidLevel: 500,
    teamSize: 1,
    salted: true,
    avernic: true,
  });

  const [hpState, setHpState] = useState<HpStateStack>([]);
  const [subQueue, setSubQueue] = useState<number[]>([]);

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
  }: {
    weapon: Item;
    weaponTicks: number;
    dmg: number;
    spec: boolean;
  }) => {
    const newStep = { weapon, weaponTicks, dmg: dmg * stats.teamSize, spec };
    if (subQueue.length > 0) {
      const first = subQueue[0];
      setSubQueue(subQueue.slice(1));
      setHpState([
        ...hpState.slice(0, first),
        newStep,
        ...hpState.slice(first + 1),
      ]);
    } else {
      setHpState([...hpState, newStep]);
    }
  };

  const handleSubstituteStep = (idx: number) => {
    if (idx < hpState.length) {
      const obj = { ...hpState[idx], dmg: -1 };
      const newHpState = [
        ...hpState.slice(0, idx),
        obj,
        ...hpState.slice(idx + 1),
      ];
      setHpState(newHpState);
      setSubQueue([...subQueue, idx].sort());
    }
  };

  const handleRemoveStep = (i: number) => {
    setHpState([...hpState.slice(0, i), ...hpState.slice(i + 1)]);
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
          >
            Clear!
          </button>
        </div>
        <CoreHpCalculator
          maxHp={Math.max(
            4500,
            4500 *
              (1 + Math.floor(stats.raidLevel / 20) * 0.02) *
              (1 + 0.9 * (stats.teamSize - 1))
          )}
          hpState={hpState}
          onRemoveStep={handleRemoveStep}
          onSubstituteStep={handleSubstituteStep}
        />
      </div>
    </>
  );
}

export default App;
