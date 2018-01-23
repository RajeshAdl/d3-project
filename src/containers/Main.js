import React from 'react'
import './style.css';
import Map from './Map'
import Routes from './Routes'

const Main = () => {
  return (
    <div className="container">
      <Routes />
      <Map />
    </div>     
  )
}

export default Main;
