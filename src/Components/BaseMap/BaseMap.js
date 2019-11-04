import React, {Component} from 'react';
import DeckGL, {BitmapLayer} from 'deck.gl';
import MapGL,{Marker, GeolocateControl,Popup} from 'react-map-gl';
import Pin from './pin.js'
import SideDrawer from '../SideDrawer/SideDrawer'
import './BaseMapStyle.css'
import RGBA from '../Images/rgba.png'
import MERGED from '../Images/merged.png'


const TOKEN = 'pk.eyJ1IjoicGF0ZWwycGEiLCJhIjoiY2sxMnkyczM0MDNxOTNiczluMnRyY2tsMiJ9.0maYtnNj3fQVEJ2BLfvJXA'; // Set your mapbox token here
const MapStyle = {
    mapboxDefault:'mapbox://styles/patel2pa/ck1lhtf917qtt1crviwyg2973',
    openMapTile: 'https://api.maptiler.com/maps/hybrid/style.json?key=gQCnC8ZYWGvM8WdKZNmW'
  }

  const geolocateStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,   
  };

  const DefaultOverlayBounds = [
    [-78.4989250540139,37.9307066927,-78.4950953896, 37.933022282],
    [-78.4977459718528, 37.92754239722171,-78.49195042016456, 37.9330963517]
  ]

  const DefaultOverlays = [RGBA,MERGED]

  
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
      markerData:[],
      popupInfo:null,
      delete:false,
      add: false,
      inputValue: []
    }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight+-40+'px',width:window.innerWidth+'px' });
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
    if (this.state.add){
      var joined = this.state.markerData.concat([e.lngLat]);
      this.setState({ markerData: joined })
    }
  }
  
  renderMarkersandPin = () => {
    const markerData_ = this.state.markerData
    return this.state.markerData.map((child, index)=>
    <Marker latitude={this.state.markerData[index][1]} longitude={this.state.markerData[index][0]} >
      <Pin size={20} key={index} onClick={(e)=>this.DeleteMarkerAndRenderPopupInput(e,index)} />
    </Marker>)
}

  DeleteMarkerAndRenderPopupInput(e, i){
    if(this.state.delete){
      this.setState({delete:false})
      this.setState(state => {
        const markerData = state.markerData.filter((item, j) => i !== j);
        return {
        markerData,
        };
      })
    }
    else{
      this.setState({popupInfo:[this.state.markerData[i],i]})
    }
  };

  RenderPopups = () => {
    const {popupInfo} = this.state;
    return (
      popupInfo && (<Popup
        tipSize={8}
        anchor="bottom"
        longitude={this.state.popupInfo[0][0]}
        latitude={ this.state.popupInfo[0][1]}
        closeOnClick={false}
        onClose={() => this.setState({popupInfo: null})}
      >
        <input value={this.state.inputValue[this.state.popupInfo[1]]} onChange={evt => this.UpdateInputValue(evt, this.state.popupInfo[1])}/>
      </Popup>
      )
    )
  }

  UpdateInputValue = (evt,index) =>{
    const updatedArray = [...this.state.inputValue];
    updatedArray[index] = evt.target.value;
    this.setState({
      inputValue: updatedArray,
      });
/*
  this.setState({
    inputValue: evt.target.value
  });*/
  }

  _renderButtonsTools = () => {
    // copy from mapbox
    return (
      <div className='Button1'>
        <div >
          <button
            title="Polygon tool (p)"
            onClick = {()=>this.setState({add:true})}
          >Add pins</button>
          <button
            className="Button"
            title="Delete"
            onClick = {()=>this.setState({add:false,delete:true})}
          >Delete pins</button>
        </div>
      </div>
    );
  };

  renderDefaultOverlay = () =>{
    for(let i = 0; i<DefaultOverlays.length;i++)
    return (<DeckGL
      viewState={this.state.viewport}
      layers={[
        new BitmapLayer({
            id: 'bitmap-layer',
            bounds: DefaultOverlayBounds[i],
            image: DefaultOverlays[i],
            transparentColor: [0,0,0,0]
          })
      ]}
    />
    )
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
          {this.renderDefaultOverlay()}
          {this.renderOverlayImages()}
          {this.renderMarkersandPin()}
          {this.RenderPopups()}
          <GeolocateControl
              style={geolocateStyle}
              positionOptions={{enableHighAccuracy: false}}
              trackUserLocation = {true}
          />
          {this._renderButtonsTools()}
        </MapGL>
      </div>
    );
  }
}

