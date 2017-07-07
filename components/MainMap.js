import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer,CircleMarker } from 'react-leaflet';
import $ from "jquery";
class MainMap extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 42.36,
      lng: -71.06,
      zoom: 13,
      projects:[]
    };
  }
  componentDidMount(){
    var that = this;
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/getprojects',
    })
    .done(function( res ) {


        that.setState({projects:res})
    });
  }
  render() {
    var count = 0;
    const Markers =
      this.state.projects.map(function(project){
        if(project.lat != '' && project.lon != '' && project.lat != undefined && project.lon != undefined){
          project.lat = project.lat<0 ? project.lat* -1 : project.lat;
          project.lon = project.lon>0 ? project.lon* -1 : project.lon;
          count+=1;
          return <CircleMarker center={[project.lat,project.lon]} color="#fff"  fillColor='orange' weight={1} opacity={0.5} fillOpacity={0.8} radius={4} key={count}>
          </CircleMarker>
        }

      });
    console.log(count)
    const position = [this.state.lat, this.state.lng];
    return (
      <Map center={position} zoom={this.state.zoom} style={{height:800,width:"50%",float:"right","z-index":0}}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
        />
        {Markers}
      </Map>
    );
  }
}
export default MainMap
