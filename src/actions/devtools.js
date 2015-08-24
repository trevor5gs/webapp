import { DT_GRID_TOGGLE, DT_GRID_CYCLE } from '../constants/action_types'


export function toggleDevtoolsGrid() {
  return {
    type: DT_GRID_TOGGLE,
  }
}

export function cycleDevtoolsGrid() {
  return {
    type: DT_GRID_CYCLE,
  }
}

