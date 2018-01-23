import { combineReducers } from 'redux'

const loadVehiclesData = (state = [], action) => {
  if(action.type === "RECEIVE_VEHICLE_DATA") {
    return action.vehicle
  }
  return state
}

const loadRoutesList = (state = [], action) => {
  if(action.type === "RECEIVE_ROUTE_LIST") {
    return action.data
  } else {
    return state
  }
}

function generateRouteObject(data, routeName) {
  return {
    data: data,
    display: true
  }
}

const updateRoutesData = (state = {}, action) => {
  switch(action.type) {
    case "UPDATE_ROUTES_DATA":
      return Object.assign({}, state, {
          [action.routeName]: generateRouteObject(action.data)
        })
    case "SHOW_ROUTE":
      return Object.assign({}, state, {
        [action.routeName]: {...state[action.routeName], display: true}
      })
    case "HIDE_ROUTE":
      return Object.assign({}, state, {
        [action.routeName]: {...state[action.routeName], display: false}
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  vehiclesData: loadVehiclesData,
  routeList: loadRoutesList,
  routesData: updateRoutesData
})

export default rootReducer