import "./App.css";
import { CoreHpCalculator } from "./components/core-hp";
import { InputBox } from "./components/input-box";
import { WeaponSelection } from "./components/weapon-selection";
import { useState } from "react";

type Stats = {
  strengthLevel: number;
  strengthBonus: number;
  raidLevel: number;
  teamSize: 1;
  salted: boolean;
};

export type HpStateStack = {
  weaponId: number;
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

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats({ ...stats, [name]: parseInt(value) });
  };

  const handleAddAttack = ({
    weaponId,
    weaponTicks,
    dmg,
    spec,
  }: {
    weaponId: number;
    weaponTicks: number;
    dmg: number;
    spec: boolean;
  }) => {
    setHpState([...hpState, { weaponId, weaponTicks, dmg, spec }]);
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
          />
          <InputBox
            label="Strength bonus"
            name="strengthBonus"
            defaultValue={0}
            onChange={handleStatsChange}
          />
          <InputBox
            label="Raid level"
            name="raidLevel"
            defaultValue={500}
            onChange={handleStatsChange}
          />
          <InputBox
            label="Team size"
            name="teamSize"
            defaultValue={1}
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
      </div>
      <CoreHpCalculator
        maxHp={6750}
        hpState={hpState}
        onRemoveStep={handleRemoveStep}
      />
    </>
  );
}

export default App;
