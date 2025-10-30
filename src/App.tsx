import "./App.css";
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

function App() {
  const [stats, setStats] = useState<Stats>({
    strengthLevel: 99,
    strengthBonus: 0,
    raidLevel: 500,
    teamSize: 1,
    salted: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats({ ...stats, [name]: parseInt(value) });
  };

  console.log(stats);
  return (
    <>
      <h1 id="title">core down simulator</h1>
      <div id="content">
        <div id="inputs">
          <InputBox
            label="Strength level"
            name="strengthLevel"
            defaultValue={99}
            onChange={handleChange}
          />
          <InputBox
            label="Strength bonus"
            name="strengthBonus"
            defaultValue={0}
            onChange={handleChange}
          />
          <InputBox
            label="Raid level"
            name="raidLevel"
            defaultValue={500}
            onChange={handleChange}
          />
          <InputBox
            label="Team size"
            name="teamSize"
            defaultValue={1}
            onChange={handleChange}
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
          onClick={({ weapon, spec }) => console.log(weapon, spec)}
          stats={stats}
        />
      </div>
    </>
  );
}

export default App;
