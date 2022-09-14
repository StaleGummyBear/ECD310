import React, { Component } from 'react'
import AccountView from './AccountView'
class MeterMapForm extends Component{
    constructor(props){
        super(props);
    }
	  state = {
        meterMap: []
    }
    onSubmit = async (event) => {
        event.preventDefault();
        const meterID = event.target.elements.meterID.value;
        const userID = event.target.elements.userID.value;
        const latitude = event.target.elements.latitude.value;
        const longitude = event.target.elements.longitude.value;

        const data = {
            meterID: meterID,
            userID: userID,
            latitude: latitude,
            longitude: longitude
          }
          console.log(data);
          JSON.stringify(data);
          
          const api_call = await fetch('http://127.0.0.1:3001/meterToUser', {
            method: 'post', 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).catch();
          this.getData();
    }
    getData = async () => {
        const api_call = await fetch(this.props.server+"getMeterMap").catch()
        const ret_data1 = await api_call.json();
        console.log(ret_data1);
        this.setState({meterMap: ret_data1});
    }

    deleteMeterMappings = async () => {
        const api_call = await fetch(this.props.server+"deleteMeterMappings").catch()
        this.getData();
    }
    componentDidMount(){
        this.getData();
    }
    render() {
        
        return(
            <div>
                <h1 className = "subHeader">Meter Assignments</h1>
                <div style = {{height: "10px"}}/>
                <div className = "accountForm" style = {{display: "flex"}}>
                    <div style = {{float: "left"}, {minWidth: "40vw"}}>
                        <h3>Update Meter Assignment</h3>
                        <form onSubmit={this.onSubmit}>
                            <label htmlFor="meterID">Meter ID</label>
                            <br/>
                            <input id="meterID" name="meterID" type="text" />
                            <br/>
                            <label htmlFor="userID">User ID</label>
                            <br/>
                            <input id="userID" name="userID" type="text" />
                            <br/>
                            <label htmlFor="latitude">Latitude</label>
                            <br/>
                            <input id = "latitude" name = "latitude" type = "text"/>
                            <br/>
                            <label htmlFor="longitude">Longitude</label>
                            <br/>
                            <input id = "longitude" name = "longitude" type = "text"/>
                            <br/>
                            <div style = {{minHeight: "10px"}}/>
                            <button>Update Meter Assignment</button>
                        </form>
                    </div>
                    <div>
                        <h3>Users</h3>
                        <AccountView server = {this.props.server}/>
                    </div>

                    <div style = {{minWidth: "10vw"}}/>
                    
                    <div>
                        <h3>Meters</h3>      
                        <table style = {{float: "right"}}>
                            <thead>
                                <tr>
                                    <th>Meter ID</th>
                                    <th>User ID</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.meterMap.map((e, i) => {
                                    return(
                                        <tr key = {i.toString()}>
                                            <td>{e.meterID}</td>
                                            <td>{e.userID}</td>
                                            <td>{e.latitude}</td>
                                            <td>{e.longitude}</td>
                                        </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>  
                        <button onClick = {this.deleteMeterMappings}>Remove Meter Mappings</button>
                    </div>
                    
                </div>
            </div>
        );
    }
}
export default MeterMapForm;