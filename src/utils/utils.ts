import { ROWS, COLS, MINE_COUNT } from '../constants/constants'
import { Cell, CellValue, CellState } from '../types/types'

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = []

  // create cell matrix
  for (let i = 0; i < ROWS; i++) {
    cells.push([])

    for (let j = 0; j < COLS; j++) {
      cells[i].push({
        value: CellValue.none,
        state: CellState.closed
      })
    }
  }

  // place mines & set adjecent cell values
  let minesPlaced = 0
  while (minesPlaced < MINE_COUNT) {
    const mineRow = Math.floor(Math.random() * ROWS)
    const mineCol = Math.floor(Math.random() * COLS) 
    
    const chosenCell = cells[mineRow][mineCol]
    if (chosenCell.value === CellValue.mine) continue

    chosenCell.value = CellValue.mine
    minesPlaced++
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (cells[mineRow + i]?.[mineCol + j]?.value !== undefined && cells[mineRow + i][mineCol + j].value !== CellValue.mine) {
          cells[mineRow + i][mineCol + j].value++
        }
      }
    }
  }

  return cells
}
