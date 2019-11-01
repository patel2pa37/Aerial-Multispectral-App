import React from 'react';
import BaseMap from './Components/BaseMap/BaseMap.js'
import Toolbar from './Components/NavigationBar/ToolBar.js' 
import Backdrop from './Components/SideDrawer/Backdrop.js'


class App extends React.Component {
  state = {
      sideDrawerOpen: false,  
    }

  /*
    method sets the sideDraweropen to true or false
  */
  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  
  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false })
  }

  render() {
    let backdrop

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />
    }

    return (
      <div style={{ height: '100%' }}>
        <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
      {backdrop}
        
        <main >
          <BaseMap parentCallback = {this.state.sideDrawerOpen}/>
        </main>
      </div>
    )
  }
}

export default App
