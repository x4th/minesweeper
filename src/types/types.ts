export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  mine
}

export enum CellState {
  open = 'open',
  closed = 'closed',
  flag = 'flag'
}

export type Cell = {
  value: CellValue,
  state: CellState
}
