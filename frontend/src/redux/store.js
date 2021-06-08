import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import dataReducer from './reducers/dataReducer'
import userReducer from './reducers/userReducer'
import uiReducer from './reducers/uiReducer'

const reducers = combineReducers({
    data: dataReducer,
    user: userReducer,
    UI: uiReducer
})
const initialState = {}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(reducers, initialState, composeEnhancers(
    applyMiddleware(thunk)
))

export default store