import fetch from 'isomorphic-fetch'
import { VEHICLES_URL, ROUTE_LIST, ROUTE_INFO } from './constants'

function showRoute(routeName) {
  return {
    type: "SHOW_ROUTE",
    routeName
  }
}

function hideRoute(routeName) {
  return {
    type: "HIDE_ROUTE",
    routeName
  }
}

function updateRoutesData(routeName, data) {
  return {
    type: "UPDATE_ROUTES_DATA",
    routeName,
    data
  }
}

function fetchRoute(routeName) {
  return dispatch => {
    fetch(`${ROUTE_INFO}${routeName}`)
      .then(response => response.json())
      .then(data => dispatch(updateRoutesData(routeName, data)))
  }
}

function shouldFetchRoute(state, routeName) {
  const route = state.routesData[routeName] 

  if (!route) {
    return true
  } else {
    return false
  }
}

function fetchRouteIfNeeded(routeName, value) {
  return (dispatch, getState) => {
    if (shouldFetchRoute(getState(), routeName)) {
      return dispatch(fetchRoute(routeName, value))
    } else {
      return dispatch(showRoute(routeName))
    }
  }
}

export function updateRoutes(route, value) {
  if(value) {
    return fetchRouteIfNeeded(route, value)
  } else {
    return hideRoute(route)
  }
}

function getCurrentTime() {
  // Adding 1min delay to the time 
  const time = (new Date()).getTime() - 60000
  return time
}

function vehiclesData(data) {
  return {
    type: "RECEIVE_VEHICLE_DATA",
    vehicle: data.vehicle
  }
}

export function initialRender() {
  return dispatch => {
    const time = getCurrentTime();
    fetch(`${VEHICLES_URL}${time}`)
      .then(response => response.json())
      .then(data => dispatch(vehiclesData(data)))
  }
}

export function fetchVehicles() {
  return dispatch => {
    setInterval(() => {
      const time = getCurrentTime();
      fetch(`${VEHICLES_URL}${time}`)
        .then(response => response.json())
        .then(data => dispatch(vehiclesData(data)))
    }, 15000);
  }
}

function routeList(data) {
  return {
    type: "RECEIVE_ROUTE_LIST",
    data: data
  }
}

export function loadRoutesData() {
  return dispatch => {
    fetch(`${ROUTE_LIST}`)
      .then(response => response.json())
      .then(data => dispatch(routeList(data)))
  }
}
