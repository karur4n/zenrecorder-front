import { Room } from '../domain/Room'

type JOINED_ROOM_ACTION = {
  type: 'JOINED_ROOM'
  payload: {
    room: Room
  }
}

export type AppAction = JOINED_ROOM_ACTION

type State = {
  room?: Room
}

export function appReducer(state: State | undefined, action: AppAction): State {
  switch (action.type) {
    case 'JOINED_ROOM':
      return {
        ...state,
        room: action.payload.room,
      }
    default:
      return {}
  }
}
