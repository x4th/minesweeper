import React, { useState, useEffect } from 'react'

import NumberDisplay from '../NumberDisplay/NumberDisplay'
import { generateCells } from '../../utils/utils'
import Tile from '../Tile/Tile'
import { Faces, CellValue, CellState } from '../../types/types'
import { FLAG_COUNT } from '../../constants/constants'

import './App.scss'

interface FaceProps {
  which: Faces,
  onClick: any, // TODO: set this later
}

const Face: React.FC<FaceProps> = ({ which, onClick }) => {
  return (
    <div className='Face' onClick={onClick}>
      <span role='img' aria-label='face'>{which}</span>
    </div>
  )
}

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells())
  const [flagsRemaining, setFlagsRemaining] = useState(FLAG_COUNT)
  const [face, setFace] = useState(Faces.default)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [playing, setPlaying] = useState(false)

  // TODO: use setInteval
  useEffect(() => {
    if (playing) {
      const secondsTimeout = setTimeout(() => setSecondsElapsed(secondsElapsed => secondsElapsed + 1), 1000)

      return () => {
        clearTimeout(secondsTimeout)
      }
    }
    
  }, [playing, secondsElapsed])

  const handleTileClick = (row: number, column: number) => {
    if (!playing) setPlaying(true)
  }

  const handleTileContext = (row: number, column: number) => {
    const currentTile = cells[row][column]

    switch (currentTile.state) {
      case CellState.closed:
        // if (flagsRemaining === 0) break
        currentTile.state = CellState.flag
        setFlagsRemaining(flagsRemaining => flagsRemaining - 1)
        break
      case CellState.flag:
        currentTile.state = CellState.closed
        setFlagsRemaining(flagsRemaining => flagsRemaining + 1)
        break
      default:
        break
    }
  }

  const handleFaceClick = () => {
    setPlaying(false)
    setSecondsElapsed(0)
    setFlagsRemaining(FLAG_COUNT)
    setCells(generateCells())
  }

  const handleTileMouseDown = (e: React.MouseEvent) => {
    // differentiate between mouse buttons - here we need a left click
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    if (e.buttons === 1) setFace(Faces.worried)
  }

  const handleTileMouseUp = () => {
    setFace(Faces.default)
  }

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) => row.map((cell, colIndex) => 
      <Tile
        key={`${rowIndex}-${colIndex}`}
        row={rowIndex}
        col={colIndex}
        state={cell.state}
        value={cell.value}
        onClick={() => handleTileClick(rowIndex, colIndex)}
        onContext={(e: any) => {e.preventDefault(); handleTileContext(rowIndex, colIndex)}} // TODO: type
        onMouseDown={handleTileMouseDown}
        onMouseUp={handleTileMouseUp}
      />
    ))
  }

  return (
    <div className='App'>
      <div className='Header'>
        <NumberDisplay value={flagsRemaining} />
        <Face which={face} onClick={handleFaceClick} />
        <NumberDisplay value={secondsElapsed} />
      </div>
      <div className='Body'>
        {renderCells()}
      </div>
    </div>
  )
}

export default App
