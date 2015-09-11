import { DT_GRID_TOGGLE, DT_GRID_CYCLE } from '../constants/action_types'


export function toggleDevGrid() {
  return {
    type: DT_GRID_TOGGLE,
  }
}

export function cycleDevGrid() {
  return {
    type: DT_GRID_CYCLE,
  }
}

