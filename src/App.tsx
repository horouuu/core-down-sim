import "./App.css";
import { InputBox } from "./components/input-box";
import { WeaponSelection } from "./components/weapon-selection";

function handleInput() {}

function App() {
  return (
    <>
      <h1 id="title">core down simulator</h1>
      <div id="content">
        <div id="inputs">
          <InputBox
            label="Strength level"
            name="strengthLevel"
            defaultValue={99}
          />
          <InputBox
            label="Strength bonus"
            name="strengthBonus"
            defaultValue={0}
          />
          <InputBox label="Raid level" name="raidLevel" defaultValue={500} />
          <InputBox label="Team size" name="teamSize" defaultValue={1} />
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
            "burning claws",
            "fang",
            "*fang",
            "ghrazi",
            "keris partisan",
            "tentacle",
            "voidwaker",
          ]}
          onClick={({ weapon, spec }) => console.log(weapon, spec)}
        />
      </div>
    </>
  );
}

export default App;
