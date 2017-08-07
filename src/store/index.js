import { combineReducers } from 'redux'
import { routerReducer } from "react-router-redux"
import world from './world'
import user from './user'
import logger from './logger'

/* Combine all of our app's reducers */
const makeRootReducer = () => {
    return combineReducers({
	routing: routerReducer, // routes
	world, // relating to setting and user interaction
	user, // relating to user account
	logger // relating to logging
    })
}

export default makeRootReducer
