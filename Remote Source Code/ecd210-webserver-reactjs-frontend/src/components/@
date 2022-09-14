import React, { Component } from 'react'
import GoogleMapContainer from './GoogleMapContainer'
import MeterTable from './MeterTable'
class UtilityInterface extends Component{
    constructor(props){
        super(props);
      }
	state = {
        meters: []
    }
    updateState = (meters) => {
        this.setState({
            meters: meters
        })
    }
    render(){
        return (
            <div className = {"utilityInterface"}>
                <p className = {"subHeader"}>Utility Interface</p>
                <br/>
                <GoogleMapContainer meters = {this.state.meters} server = {this.props.server}/>
                <div style = {{minHeight: "5vh"}}/>
                <MeterTable setParentState = {this.updateState} server = {this.props.server}/>
            </div>
            
        );
    }
}

export default UtilityInterface;
