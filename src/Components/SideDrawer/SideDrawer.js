import React from 'react'
import './SideDrawer.css'
import axios from 'axios';

const backEndURL = `http://127.0.0.1:8000/api/`
//sideDrawer class

export default class sideDrawer extends React.Component{

  /*
  state, stores data,
  whenever the data changes, 
  the site is rerender to incorporate the changes
  */
  state = {
    BackEndData:[]
    }
  
  /*
  componentDidMount is a default react method
  that is called before the site is rendered,
  this one get the data living at  backEndURL
  */
  componentDidMount() {
    axios.get(backEndURL)
      .then(res => {
        this.setState({BackEndData:res.data})
        this.props.parentCallback(res.data)
      })
  }

  SetState = () => {
    axios.get(backEndURL)
    .then(res => {
    this.setState({BackEndData:res.data})
    this.props.parentCallback(res.data)
    //window.location.reload();
  })}

  /*
    the following method does stuff with 
    checkboxes within the sidebar
  */
  RederListInSideDrawer = (child) => {
    const overLays = this.state.BackEndData
    return  overLays.map((child)=>
    <li>
      <a> <input type="checkbox" key={child.id} checked = {this.state.BackEndData[child.id-1].boxChecked}
      onChange= {(e)=>this.HandleCheckBox(child.id)} />OverLay {child.id}</a>
      <p>{this.state.BackEndData[child.id-1].content}</p>
      <p>Date </p>
    </li>
    )
  }

  /*
  the following method is used to for checkboxes and storing 
  */
  HandleCheckBox = (child) => {
    let dataCopy = JSON.parse(JSON.stringify(this.state.BackEndData))
    dataCopy[child-1].boxChecked = !dataCopy[child-1].boxChecked
    this.setState({BackEndData:dataCopy})
  }

  /*
  sends data to backend to update
  */
  HandleSave = () =>{
    let dataLength = this.state.BackEndData.length
    var i;
    for (i = 1; i<=dataLength;i++){
      if(i == dataLength){
        axios.patch(backEndURL+`${i}/`,{
          boxChecked:this.state.BackEndData[i-1].boxChecked
        })
      }
      else{
        axios.patch(backEndURL+`${i}/`,
        {
        boxChecked:this.state.BackEndData[i-1].boxChecked
        })
      }
    }
    setTimeout(this.SetState,1000)
  }
      
  render(){
    let drawerClasses = 'side-drawer'
    if (this.props.show) {
    drawerClasses = 'side-drawer open'
  }

  return (
    <div>
      <nav className="side-drawer">
        <ul>
          <button onClick = {(e)=>this.HandleSave()}>Save</button>
          {this.RederListInSideDrawer()}
        </ul>
      </nav>
    </div>
    )
  }
}













