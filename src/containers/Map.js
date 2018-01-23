import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'

import { SVG_WIDTH, SVG_HEIGHT } from '../actions/constants'
import { projection, geoPath } from '../utils'
import { initialRender, fetchVehicles } from '../actions'

import streetsData from '../data/streets'
import freewaysData from '../data/freeways'
import neighborhoodsData from '../data/neighborhoods'
import arteriesData from '../data/arteries'


class Map extends React.Component {

  constructor() {
    super();
    this.drawProjection = this.drawProjection.bind(this);
  }

  componentDidMount() {
    let svg = d3.select("#map")
      .append("svg")
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT);

    const neighborhoods = svg.append('g');
    const arteries = svg.append('g');
    const freeways = svg.append('g');
    const streets = svg.append('g');

    // Draw SF map
    this.drawProjection(streets, geoPath, streetsData);
    this.drawProjection(arteries, geoPath, freewaysData);
    this.drawProjection(freeways, geoPath, neighborhoodsData);
    this.drawProjection(neighborhoods, geoPath, arteriesData);

    this.props.initialRender();
    this.props.fetchVehicles();
  }

  drawProjection(selection, path, data) {
    selection
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('fill', '#eee')
      .attr('d', path)
      .attr('stroke', '#222')
      .attr('stroke-width', 0.25)
  }

  drawVehicles(data) {
    let update = d3.select("svg")
      .selectAll("circle")
      .data(data, data => data.id)

    update
      .exit()
      .transition()
        .duration(500)
        .attr('r', 0)
      .remove();

    update
      .enter()
      .append("circle")
        .attr("cx", (d) => projection([d.lon, d.lat])[0])
        .attr("cy", (d) => projection([d.lon, d.lat])[1])
      .merge(update)
      .transition()
        .duration(500)
        .attr("cx", (d) => projection([d.lon, d.lat])[0])
        .attr("cy", (d) => projection([d.lon, d.lat])[1])
        .attr("fill", "red")
        .attr("r", "3px")
  }

  render() {
    const { vehiclesData } = this.props;

    return (
        <div id="map" style={{"margin": "0 auto"}}>
          {vehiclesData ? this.drawVehicles(vehiclesData) : <div>Loading...</div>}
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    vehiclesData: state.vehiclesData
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
    fetchVehicles: () => { dispatch(fetchVehicles()) }, 
    initialRender: () => { dispatch(initialRender()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)