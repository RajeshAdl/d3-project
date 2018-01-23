import React from 'react'
import { connect } from 'react-redux'
import { loadRoutesData, updateRoutes } from '../actions'
import * as d3 from 'd3'
import { lineFunction } from '../utils'

const Route = ({title, tag, onChange}) => {
  return (
    <span>
      <input type="checkbox" id={tag} value={tag} name={tag} onChange={onChange} />
      <label htmlFor={tag}> {title} </label>
      <br/>
    </span>
  )
}

class Routes extends React.Component {
  constructor() {
    super()
    this.onRouteClick = this.onRouteClick.bind(this)
    this.drawRoutes = this.drawRoutes.bind(this)
  }
  
  componentDidMount() {
    this.props.loadRoutesList()
  }

  onRouteClick(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.props.updateRoutes(name, value)
  }

  drawRoutes(routesData) {
    let svg = d3.select("svg")

    if(svg.select("#routes") !== undefined) {
      svg.selectAll("#routes").remove()
    }

    let routesvg = svg.append("g")
        .attr("id", "routes");

    for(let key in routesData) {
      if(routesData[key].display === true) {    
        let color = "#"+routesData[key].data.route.color;
        
        routesData[key].data.route.path.map((path) => {
          routesvg.append("path")
          .attr("d", lineFunction(path.point))
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("fill", "none")
        })
      } 
    }
  }

  render() {
    const routeList = this.props.routeList || []
    const routesData = this.props.routesData || {}

    this.drawRoutes(routesData)

    return (
      <div id="route-list">
          {routeList.map(route => 
            <Route  key={route.tag} 
                    tag={route.tag}
                    title={route.title}
                    onChange={this.onRouteClick} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    routeList: state.routeList.route,
    routesData: state.routesData
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadRoutesList: () => {
      dispatch(loadRoutesData())
    },
    updateRoutes: (name, value) => {
      dispatch(updateRoutes(name, value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)