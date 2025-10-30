import "./App.css";
import { InputBox } from "./components/input-box";

function App() {
  return (
    <>
      <h1 id="title">core down simulator</h1>
      <div id="inputs">
        <InputBox label="Strength level" defaultValue={99} />
        <InputBox label="Strength bonus" defaultValue={0} />
        <InputBox label="Raid level" defaultValue={500} />
        <InputBox label="Team size" defaultValue={1} />
      </div>
    </>
  );
}

export default App;
