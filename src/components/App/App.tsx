import React, { useState, useEffect } from "react";

import NumberDisplay from "../NumberDisplay/NumberDisplay";
import { generateCells, openCells } from "../../utils/utils";
import Cell from "../Cell/Cell";
import { Faces, CellValue, CellState } from "../../types/types";
import { ROWS, COLS, MINE_COUNT } from "../../constants/constants";

import "./App.scss";

interface FaceProps {
  which: Faces;
  onClick: any; // TODO: set this later
}

const Face: React.FC<FaceProps> = ({ which, onClick }) => {
  return (
    <div className="Face" onClick={onClick}>
      <span role="img" aria-label="face">
        {which}
      </span>
    </div>
  );
};

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());
  const [flagsRemaining, setFlagsRemaining] = useState(MINE_COUNT);
  const [face, setFace] = useState(Faces.default);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // eslint-disable-next-line
  const [closedCellsRemaining, setClosedCellsRemaining] = useState(ROWS * COLS);
  const [touch, setTouch] = useState({
    timeoutID: 0,
    happening: false,
  });

  // TODO: use setInteval
  useEffect(() => {
    if (playing && secondsElapsed < 999) {
      const secondsTimeout = setTimeout(
        () => setSecondsElapsed((secondsElapsed) => secondsElapsed + 1),
        1000
      );

      return () => {
        clearTimeout(secondsTimeout);
      };
    }
  }, [playing, secondsElapsed]);

  const explodeAndShowMines = (row: number, column: number) => {
    let updatedCells = cells.map((column) =>
      column.map((cell) =>
        cell.value !== CellValue.mine
          ? cell
          : { state: CellState.open, value: cell.value }
      )
    );
    updatedCells[row][column] = {...updatedCells[row][column], state: CellState.exploded}

    setCells(updatedCells);
  };

  const handleCellClick = (row: number, column: number) => {
    if (gameOver) return;

    let currentCell = { ...cells[row][column] };
    if ([CellState.flag, CellState.open].includes(currentCell.state)) return;
    let updatedCells = cells.map(row => row.slice())

    if (!playing) {
      // don't allow mine on first click
      do {
        updatedCells = generateCells()
        currentCell = updatedCells[row][column]
      } while (currentCell.value === CellValue.mine)
      setPlaying(true);
    }

    if (currentCell.value === CellValue.mine) {
      // game lost
      setPlaying(false);
      setGameOver(true);
      setFace(Faces.deado);
      explodeAndShowMines(row, column);
      return;
    } else {
      updatedCells = openCells(updatedCells, row, column);
    }

    setCells(updatedCells);
    const closedCellsRemaining = updatedCells
      .flat()
      .reduce(
        (acc, cur) =>
          cur.state === CellState.closed || cur.state === CellState.flag
            ? acc + 1
            : acc,
        0
      );
    setClosedCellsRemaining(closedCellsRemaining);
    if (closedCellsRemaining > MINE_COUNT) return;
    
    // game won
    updatedCells = updatedCells.map(row => row.map(cell => cell.state === CellState.closed ? {...cell, state: CellState.flag} : cell))
    setCells(updatedCells)
    setPlaying(false);
    setGameOver(true);
    setFace(Faces.cool);
  };

  const handleCellContext = (row: number, column: number) => {
    const currentCell = cells[row][column];

    switch (currentCell.state) {
      case CellState.closed:
        currentCell.state = CellState.flag;
        setFlagsRemaining((flagsRemaining) => flagsRemaining - 1);
        break;
      case CellState.flag:
        currentCell.state = CellState.closed;
        setFlagsRemaining((flagsRemaining) => flagsRemaining + 1);
        break;
      default:
        break;
    }
  };

  const handleCellTouchStart = (row: number, column: number) => {
    setTouch({
      timeoutID: window.setTimeout(() => handleCellContext(row, column), 500),
      happening: true,
    });
  };

  const handleCellTouchEnd = () => {
    clearTimeout(touch.timeoutID);
    setTouch({
      timeoutID: 0,
      happening: false,
    });
  };

  const handleFaceClick = () => {
    setPlaying(false);
    setGameOver(false);
    setSecondsElapsed(0);
    setFlagsRemaining(MINE_COUNT);
    setCells(generateCells());
    setFace(Faces.default);
  };

  const handleCellMouseDown = (e: React.MouseEvent) => {
    // differentiate between mouse buttons - here we need a left click
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    if (!gameOver && e.buttons === 1) {
      (e.target as HTMLDivElement).classList.add("active");
    }
  };

  const handleCellMouseUp = () => {
    if (!gameOver) setFace(Faces.default);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          row={rowIndex}
          col={colIndex}
          state={cell.state}
          value={cell.value}
          onClick={() => handleCellClick(rowIndex, colIndex)}
          onContext={(e: React.MouseEvent) => {
            e.preventDefault();
            handleCellContext(rowIndex, colIndex);
          }}
          onMouseDown={handleCellMouseDown}
          onMouseUp={handleCellMouseUp}
          onTouchStart={(e: React.TouchEvent) =>
            handleCellTouchStart(rowIndex, colIndex)
          }
          onTouchEnd={handleCellTouchEnd}
        />
      ))
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={flagsRemaining} />
        <Face which={face} onClick={handleFaceClick} />
        <NumberDisplay value={secondsElapsed} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
