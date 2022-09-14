import React, { Component } from 'react'
import ConsumerInterfaceSubSection from './ConsumerInterfaceSubSection'
import MeterTableConsumer from './MeterTableConsumer'
class ConsumerInterface extends Component{
    constructor(props){
        super(props);
    }
	
    state = {
        cur_meter_data: [],
    }

    getMeterData = async (e) => {
        var user_number = this.props.userID;
        var data = {userID: user_number}
        var api_call = await fetch(this.props.server+"userToMeters", {
          method: 'post',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        var ret_data = await api_call.json();
        console.log(ret_data);

        var meterDataArray = new Array();
        for(var i = 0; i < ret_data.length; i++){
            data = {meter_id: ret_data[i].meterID}
            api_call = await fetch(this.props.server+"getMeterData",{
              method: 'post', 
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
            var ret_data2 = await api_call.json();
            meterDataArray.push(ret_data2);
        }
        this.setState({
          cur_meter_data: meterDataArray
        })
    }
    componentDidMount(){
        this.getMeterData();
    }
    
    
    render(){
        return (//Need to make a table for every meter mapped to this user
            <div className = {"utilityInterface"}>
              <p className = {"subHeader"}>Consumer Interface</p>
              {this.state.cur_meter_data.map((e,i) => {
                return(
                  <div>
                    <ConsumerInterfaceSubSection meterID = {i+1} data = {e}/>
                    <div style = {{minHeight: "10px"}}/>
		    <MeterTableConsumer setParentState = {this.updateState} server = {this.props.server}/>
                  </div>
                )
              })}
            </div>
            
        );
    }
}

export default ConsumerInterface;
