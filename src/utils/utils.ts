import { ROWS, COLS } from '../constants/constants'
import { Cell, CellValue, CellState } from '../types/types'

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = []

  for (let row = 0; row < ROWS; row++) {
    cells.push([])

    for (let col = 0; col < COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.closed
      })
    }
  }

  return cells
}