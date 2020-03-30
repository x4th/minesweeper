import React from 'react'

import './Cell.scss'
import { CellState, CellValue } from '../../types/types'

interface CellProps {
  row: number,
  col: number,
  state: CellState,
  value: CellValue,
  onClick: any, // TODO: set this later
  onContext: any, // TODO: set this later
  onMouseDown: any,
  onMouseUp: any
}

const Tile: React.FC<CellProps> = ({ row, col, state, value, onClick, onContext, onMouseDown, onMouseUp }) => {
  const colors = ['blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'gray']
  const renderContent = (): React.ReactNode => {
    switch (state) {
      case CellState.open:
        if (value === CellValue.mine) {
          return <span role='img' aria-label='mine'>💣️</span>
        } else {
          return value ? value : ''
        }
      case CellState.flag:
        return <span role='img' aria-label='flag'>🚩️</span>
      default:
        break
    }
  }

  let style
  if (value > 0 && value < CellValue.mine) {
    style = { color: colors[value] }
  }
  return (
    <div
      style={style}
      className={`Cell ${state}`}
      onClick={onClick}
      onContextMenu={onContext}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {renderContent()}
    </div>
  )
}

export default Tile
