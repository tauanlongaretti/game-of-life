import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import { SketchPicker } from "react-color";

const numRows = 25;
const numCols = 25;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const Grid = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [generation, setGeneration] = useState(false);
  const speedRef = useRef(500);
  const [running, setRunning] = useState(false);
  const [color, setColor] = useState("#87CEFA");
  const [showPicker, setShowPicker] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      let gridState = false;
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridState = 2;
              gridCopy[i][k] = 1;
            }
          }
        }
        if (gridState) {
          setGeneration((num) => num + 0.5);
        }
      });
    });

    setTimeout(runSimulation, speedRef.current);
  }, []);

  return (
    <div className="grid">
      <div className="grid-container">
        <div className="controls">
          <div className="top-controls">
            <div>
                <h3>Controls</h3>
              <button
                className="button"
                onClick={() => {
                  setRunning(!running);
                  if (!running) {
                    runningRef.current = true;
                    runSimulation();
                  }
                }}
              >
                {running ? "stop" : "start"}
              </button>
              <button
                className="button"
                onClick={() => {
                  const rows = [];
                  for (let i = 0; i < numRows; i++) {
                    rows.push(
                      Array.from(Array(numCols), () =>
                        Math.random() > 0.7 ? 1 : 0
                      )
                    );
                  }

                  setGrid(rows);
                }}
              >
                random
              </button>

              <button
                className="button"
                onClick={() => {
                  setGrid(generateEmptyGrid()); setGeneration(false);
                }}
              >
                clear
              </button>
            </div>
            <div>
              <h3 className="speed">Speed</h3>
              <button
                className="button"
                onClick={() => {
                  speedRef.current = 1000;
                }}
              >
                Slow
              </button>
              <button
                className="button"
                onClick={() => {
                  speedRef.current = 500;
                }}
              >
                Normal
              </button>
              <button
                className="button"
                onClick={() => {
                  speedRef.current = 100;
                }}
              >
                Fast
              </button>
            </div>
          </div>
          <h3>Color</h3>
          <button className="button" onClick={() => setShowPicker(!showPicker)}>
            {showPicker ? "Close" : "Choose"}
          </button>
          {showPicker && (
            <div style={{ position: "absolute" }}>
              <SketchPicker
                color={color}
                onChange={(color) => {
                  setColor(color.hex);
                }}
              />
            </div>
          )}
        </div>
        <div className="grid-section">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
            }}
          >
            {grid.map((rows, x) =>
              rows.map((col, y) => (
                <div
                  key={`${x}-${y}`}
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[x][y] = grid[x][y] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: grid[x][y] ? color : undefined,
                    border: "solid 1px white",
                  }}
                />
              ))
            )}
          </div>
          <p className="generation">Generation: {generation}</p>
        </div>
      </div>
    </div>
  );
};

export default Grid;
