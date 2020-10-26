import React from "react";
import Grid from "./Components/Grid.js";
import Rules from "./Components/Rules.js";
import "./App.css";

const App = () => {
  return (
    <div>
      <h1 className="header">Conway's Game of Life</h1>
      <div className="app">
        <Rules />
        <Grid />
      </div>
    </div>
  );
};

export default App;
