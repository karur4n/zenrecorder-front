import { combineReducers, createStore } from 'redux'
import { appReducer } from './appReducer'

const reducers = combineReducers({
  app: appReducer,
})

export type AppState = ReturnType<typeof reducers>

export function configureStore() {
  return createStore(reducers)
}
