import React, { useState } from "react";
import "./App.css";

const SudokuSolver = () => {
  const emptyGrid = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  const examplePuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const [grid, setGrid] = useState(examplePuzzle);
  const [solving, setSolving] = useState(false);

  const isValid = (board, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleSolve = () => {
    setSolving(true);
    const gridCopy = grid.map((row) => [...row]);

    setTimeout(() => {
      if (solveSudoku(gridCopy)) {
        setGrid(gridCopy);
      } else {
        alert("No solution exists for this puzzle!");
      }
      setSolving(false);
    }, 100);
  };

  const handleCellChange = (row, col, value) => {
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= 9) {
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? num : cell))
      );
      setGrid(newGrid);
    }
  };

  const handleReset = () => {
    setGrid(emptyGrid);
  };

  const handleLoadExample = () => {
    setGrid(examplePuzzle);
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Sudoku Solver</h1>
        <p className="subtitle">
          Enter your puzzle or load an example, then click Solve
        </p>

        <div className="sudoku-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength="1"
                  value={cell === 0 ? "" : cell}
                  onChange={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.value)
                  }
                  className={`cell ${
                    colIndex % 3 === 2 && colIndex !== 8 ? "border-right" : ""
                  } ${
                    rowIndex % 3 === 2 && rowIndex !== 8 ? "border-bottom" : ""
                  }`}
                  disabled={solving}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="button-container">
          <button
            onClick={handleSolve}
            disabled={solving}
            className="btn btn-solve"
          >
            {solving ? "Solving..." : "Solve Puzzle"}
          </button>
          <button
            onClick={handleLoadExample}
            disabled={solving}
            className="btn btn-example"
          >
            Load Example
          </button>
          <button
            onClick={handleReset}
            disabled={solving}
            className="btn btn-reset"
          >
            Clear Grid
          </button>
        </div>
      </div>
    </>
  );
};

export default SudokuSolver;
