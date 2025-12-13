import React, { useReducer, useState } from "react";

const initialState = {
  count: 0,
  declick: 0,
  inclick: 0,
};
const CounterREducer = (state, action) => {
  switch (action.type) {
    case "INC":
      return {
        ...state,
        count: state.count + 1,
        inclick: state.inclick + 1,
      };
    case "DEC":
      return {
        ...state,
        count: state.count - 1,
        declick: state.declick + 1,
      };
    case "RESET":
      return {
        ...state,
        count: 0,
        inclick: 0,
        declick: 0,
      };
    default:
      return state;
  }
};

function App() {
  const [{ count, inclick, declick }, dispatch] = useReducer(
    CounterREducer,
    initialState
  );

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const increament = () => {
    dispatch({ type: "INC" });
  };
  const decreament = () => {
    dispatch({ type: "DEC" });
  };
  return (
    <>
      <h1 className="h1">Simple Counter App Using React</h1>
      <div className="parent">
        <h1>{count}</h1>
        <button onClick={increament}>Increament</button>
        <button className="de" onClick={decreament}>
          Decreament
        </button>
        <button className="re" onClick={reset}>
          Reset
        </button>

        <p>Clicks on increament : {inclick} </p>
        <p>Clicks on Decreament : {declick} </p>
      </div>
    </>
  );
}

export default App;
