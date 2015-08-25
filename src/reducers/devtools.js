import { DT_GRID_TOGGLE, DT_GRID_CYCLE } from '../constants/action_types'

const initialState = {
  payload: {
    horizontalGridIsVisible: false,
    verticalGridIsVisible: false,
  },
}

// Toggles the full grid overlay.
function getGridForToggle(payload) {
  const hasHorizontal = payload.horizontalGridIsVisible
  const hasVertical = payload.verticalGridIsVisible
  if (hasHorizontal && hasVertical) {
    return { horizontalGridIsVisible: false, verticalGridIsVisible: false }
  } else if (!hasHorizontal && !hasVertical) {
    return { horizontalGridIsVisible: true, verticalGridIsVisible: true }
  } else if (hasHorizontal && !hasVertical) {
    return { horizontalGridIsVisible: hasHorizontal, verticalGridIsVisible: true }
  } else if (!hasHorizontal && hasVertical) {
    return { horizontalGridIsVisible: true, verticalGridIsVisible: hasVertical }
  }
  return { horizontalGridIsVisible: hasHorizontal, verticalGridIsVisible: hasVertical }
}

// Cycles through horizontal and vertical grid lines being on.
function getGridForCycle(payload) {
  const hasHorizontal = payload.horizontalGridIsVisible
  const hasVertical = payload.verticalGridIsVisible
  if (hasHorizontal && hasVertical) {
    return { horizontalGridIsVisible: false, verticalGridIsVisible: hasVertical }
  } else if (!hasHorizontal && !hasVertical) {
    return { horizontalGridIsVisible: hasHorizontal, verticalGridIsVisible: true }
  } else if (hasHorizontal && !hasVertical) {
    return { horizontalGridIsVisible: false, verticalGridIsVisible: true }
  } else if (!hasHorizontal && hasVertical) {
    return { horizontalGridIsVisible: true, verticalGridIsVisible: false }
  }
  return { hasHorizontal: hasHorizontal, hasVertical: hasVertical }
}


export function devtools(state = initialState, action) {
  switch (action.type) {

  case DT_GRID_TOGGLE:
  case DT_GRID_CYCLE:
    const nextGridState = (action.type === DT_GRID_TOGGLE)
      ? getGridForToggle(state.payload)
      : getGridForCycle(state.payload)

    return {
      type: action.type,
      meta: action.meta,
      error: action.error,
      payload: {
        ...state.payload,
        horizontalGridIsVisible: nextGridState.horizontalGridIsVisible,
        verticalGridIsVisible: nextGridState.verticalGridIsVisible,
      },
    }

  default:
    return state
  }
}

