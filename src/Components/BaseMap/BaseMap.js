import React, {Component} from 'react';
import DeckGL, {BitmapLayer} from 'deck.gl';
import MapGL,{Marker, GeolocateControl} from 'react-map-gl';
import Pin from './pin.js'
import SideDrawer from '../SideDrawer/SideDrawer'
import './BaseMapStyle.css'


const TOKEN = 'pk.eyJ1IjoicGF0ZWwycGEiLCJhIjoiY2sxMnkyczM0MDNxOTNiczluMnRyY2tsMiJ9.0maYtnNj3fQVEJ2BLfvJXA'; // Set your mapbox token here
const MapStyle = {
    mapboxDefault:'mapbox://styles/patel2pa/ck12yhywb0jyo1cn7xavx8lik',
    openMapTile: 'https://api.maptiler.com/maps/hybrid/style.json?key=gQCnC8ZYWGvM8WdKZNmW'
  }

  const geolocateStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,   
  };

  
export default class Test2 extends Component {
    state = {
      viewport: {
        longitude: -78.4989,
        latitude: 37.9307,
        zoom: 15,
      },
      width:'',
      height:'',
      data:[],
      markerData:[]
    }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight+'px',width:window.innerWidth+'px' });
  }
  
  _onViewportChange = viewport => {
    this.setState({viewport});
  };

  setDataState = (childData) => {
    this.setState({data:childData})
  }

  renderOverlayImages = () => {
    const arr = [];
    if(undefined !== this.state.data && this.state.data.length){
      for(var i = 0; i<this.state.data.length; i++){
        if(this.state.data[i].boxChecked === true){
          arr.push(<DeckGL
            viewState={this.state.viewport}
            layers={[
              new BitmapLayer({
                  id: 'bitmap-layer',
                  bounds: [-78.4989250540139,37.9307066927,-78.4950953896, 37.933022282],
                  image: this.state.data[i].imageInfo,
                  transparentColor: [0,255,255,0]
                })
            ]}
          />)
        }
        else{}
      }
      
    }
    return arr;
  }

  _onClickMethod = (map,e) => {
    var joined = this.state.markerData.concat([e.lngLat]);
    this.setState({ markerData: joined })
  }
  
  renderMarkersandPin = () => {
    let markerArray = []
    if(undefined !== this.state.markerData && this.state.markerData.length){
      for(var i = 0;i<this.state.markerData.length;i++){
      markerArray.push(<Marker latitude={this.state.markerData[i][1]} longitude={this.state.markerData[i][0]}  >
      <Pin size={20} onClick = {(e)=>console.log(e)}/>
      </Marker>)
      }
    }
    return markerArray
  }

  render() {

    let sideDrawer
    if (this.props.parentCallback) {
      sideDrawer = <SideDrawer parentCallback = {this.setDataState}/>
    }

    return (
      <div>
        {sideDrawer}
        <MapGL
          {...this.state.viewport}
          width={this.state.width}
          height={this.state.height}
          onViewportChange={this._onViewportChange}
          mapStyle = {MapStyle.mapboxDefault}
          mapboxApiAccessToken={TOKEN}
          onClick = {(e)=>this._onClickMethod(MapGL,e)}
        >
          {this.renderMarkersandPin()}
          {this.renderOverlayImages()}
          <GeolocateControl
              style={geolocateStyle}
              positionOptions={{enableHighAccuracy: false}}
              trackUserLocation = {true}
          />
        </MapGL>
      </div>
    );
  }
}

