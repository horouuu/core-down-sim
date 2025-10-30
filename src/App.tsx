import "./App.css";
import { CoreHpCalculator } from "./components/core-hp";
import { InputBox } from "./components/input-box";
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
    strengthBonus: 0,
    raidLevel: 500,
    teamSize: 1,
    salted: true,
  });

  const [hpState, setHpState] = useState<HpStateStack>([]);

  const handleStatsChange = (name: string, value: number) => {
    const newStats = { ...stats, [name]: value };
    setStats(newStats);
    if (name === "strengthLevel" || name === "strengthBonus") {
      setHpState(
        hpState.map((step) => ({
          ...step,
          dmg: step.spec
            ? getSpecMaxHitToa(
                step.weapon,
                newStats.strengthLevel,
                newStats.strengthBonus
              )
            : getMaxHitToa(
                step.weapon,
                newStats.strengthLevel,
                newStats.strengthBonus
              ),
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
    setHpState([...hpState, { weapon, weaponTicks, dmg, spec }]);
  };

  const handleRemoveStep = (i: number) => {
    setHpState([...hpState.slice(0, i), ...hpState.slice(i + 1)]);
  };

  return (
    <>
      <h1 id="title">core down simulator</h1>
      <div id="content">
        <div id="inputs">
          <InputBox
            label="Strength level"
            name="strengthLevel"
            defaultValue={99}
            onChange={handleStatsChange}
            min={1}
            max={99}
          />
          <InputBox
            label="Strength bonus"
            name="strengthBonus"
            defaultValue={0}
            onChange={handleStatsChange}
            min={0}
          />
          <InputBox
            label="Raid level"
            name="raidLevel"
            defaultValue={500}
            onChange={handleStatsChange}
            min={0}
            max={600}
          />
          <InputBox
            label="Team size"
            name="teamSize"
            defaultValue={1}
            onChange={handleStatsChange}
            min={1}
            max={8}
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
      />
    </>
  );
}

export default App;
