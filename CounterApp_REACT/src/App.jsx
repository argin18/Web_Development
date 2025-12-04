import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [inclick, setinClick] = useState(0);
  const [declick, setdeClick] = useState(0);

  const reset=()=>{
    setCount(0);
    setdeClick(0);
    setinClick(0);
  }

  const increament = () => {
    setCount(count + 1);
    setinClick(inclick + 1);
  };
  const decreament = () => {
    setCount(count - 1);
    setdeClick(declick + 1);
  };
  return (
    <>
    <h1 className="h1">Simple Counter App Using React</h1>
    <div className="parent">
     
        <h1>{count}</h1>
      <button onClick={increament}>Increament</button>
      <button className="de" onClick={decreament}>Decreament</button>
      <button className="re" onClick={reset}>Reset</button>

      <p>Clicks on increament : {inclick} </p>
      <p>Clicks on Decreament : {declick} </p>
      </div></>
  );
}

export default App;
