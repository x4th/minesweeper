import React from 'react'

import './Tile.scss'
import { CellState, CellValue } from '../../types/types'

interface TileProps {
  row: number,
  col: number,
  state: CellState,
  value: CellValue,
}

const Tile: React.FC<TileProps> = ({ row, col, state, value }) => {
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
  return <div style={style} className={`Tile ${state}`}>{renderContent()}</div>
}

export default Tile
