import { geoMercator as d3GeoMercator, geoPath as d3GeoPath, line as d3Line, curveMonotoneX as d3CurveMonotoneX} from 'd3';
import { SVG_WIDTH, SVG_HEIGHT } from '../actions/constants'

export const projection = d3GeoMercator()
  .center([-122.433701, 37.768])
  .scale(250000)
  .translate([SVG_WIDTH / 2, SVG_HEIGHT / 2]);

export const geoPath = d3GeoPath().projection(projection);

export const lineFunction = d3Line()
.x((d) => projection([d.lon, d.lat])[0])
.y((d) => projection([d.lon, d.lat])[1])
.curve(d3CurveMonotoneX);