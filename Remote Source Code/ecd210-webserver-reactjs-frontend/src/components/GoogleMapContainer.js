import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

class GoogleMapContainer extends Component{
    static defaultProps = {
        center: {
            lat: 42.0894288,
            lng: -75.9694885
        },
        zoom: 15
    };
    state = {
        data: {
            positions: [
                {
                    lat: 42.0894288,
                    lng: -75.9694885,
                    weight: 1
                },
            ],
            options:{
                opacity: 1,
                radius: 15
            }
        },
        curMapIndex: 0,
        maxMapIndex: 0,
        mapTickSpeed: 1,
        mapDataInterval: 1,
        mapDataStart: 0,
        numDataPoints: 10,
        curInterval: ""
    }

    updateMapData = async () => {
        console.log("Updated Map" + this.state.curInterval + ": " + this.state.curMapIndex);

        var data_points = new Array();
        const api_call = await fetch(this.props.server+"getMeterMap").catch()
        const ret_data1 = await api_call.json();

        for(var i = 0; i < ret_data1.length; i++){ //Loops through each meter that is currently mapped to a location
            var meter_number = ret_data1[i].meterID;
            var data = {meter_id: meter_number}
            const api_call = await fetch(this.props.server+"getMeterData", { //Gets the data for this meter
                method: 'post',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const ret_data2 = await api_call.json();
            var index = -1;
            for(var j = 0; j < ret_data2.length; j++){//Find the index to display by locating the start point using its timestamp
                if(ret_data2[j].timestamp === this.state.mapDataStart){
                    index=j;
                    break;
                }
            }
            index = index + (this.state.curMapIndex * this.state.mapDataInterval)
            if(index >= ret_data2.length){
                index = -1;
            }
            if(index !== -1){
                var dataPoint = {
                    lat: ret_data1[i].latitude,
                    lng: ret_data1[i].longitude,
                    weight: (ret_data2[ret_data2.length - 1].energy) / 200
                }
                data_points.push(dataPoint)
            }

        }
        this.setState({
            data: {
                positions: data_points,
                options:{
                    opacity: 1,
                    radius: 15
                }
            },
            curMapIndex: (this.state.curMapIndex+1) % this.state.numDataPoints
        })
    }
    startPlayback = (event) => {
        event.preventDefault();
        clearInterval(this.state.curInterval)
        const mapTickSpeed = event.target.elements.mapTickSpeed.value;
        const mapDataInterval = event.target.elements.mapDataInterval.value;
        const mapDataStart = event.target.elements.mapDataStart.value;
        const numDataPoints = event.target.elements.numDataPoints.value;
        this.setState({
            curMapIndex: 0,
            mapTickSpeed: mapTickSpeed,
            mapDataInterval: mapDataInterval,
            mapDataStart: mapDataStart,
            numDataPoints: numDataPoints,
        })
        var curInterval = setInterval(this.updateMapData, 1000 / mapTickSpeed);
        this.setState({
            curInterval: curInterval
        })
        console.log(curInterval);

    }
    stopPlayback = () => {
        clearInterval(this.state.curInterval)
    }
    componentDidMount(){
    }
    render() {
        return (
            <div className = {"googleMapContainer"}>
                <div className = {"mapContainer"} style={{ height: '50vh', width: '50%'}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: /*INSERT ACTUAL API KEY*/ "AIzaSyAYnYu2h8pZaezoyfFAv7u1Ur-mepNTBEI" }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                        heatmapLibrary={true}
                        heatmap={this.state.data}>
                    </GoogleMapReact>
                </div>
                <br/>
                <div className = {"mapControl"}>
                    <div className = "accountForm" style = {{display: "flex"}}>
                        <div style = {{minWidth: "10vw"}}/>
                        <div style = {{float: "left"}}>
                            <h3>Map Settings</h3>
                            <form onSubmit={this.startPlayback}>
                                <label htmlFor="mapTickSpeed">Tick Speed</label>
                                <br/>
                                <input id="mapTickSpeed" name="mapTickSpeed" type="text" />
                                <br/>
                                <label htmlFor="mapDataInterval">Data Interval</label>
                                <br/>
                                <input id="mapDataInterval" name="mapDataInterval" type="text" />
                                <br/>
                                <label htmlFor="mapDataStart">Data Start</label>
                                <br/>
                                <input id = "mapDataStart" name = "mapDataStart" type = "text"/>
                                <br/>
                                <label htmlFor="numDataPoints">Data Points</label>
                                <br/>
                                <input id = "numDataPoints" name = "numDataPoints" type = "text"/>
                                <br/>
                                <div style = {{minHeight: "10px"}}/>
                                <button>Start Playback</button>
                            </form>
                            <button onClick = {this.stopPlayback}>Stop Playback</button>
                        </div>
                        <div style = {{minWidth: "10vw"}}/>
                        <div>
                           <h6><b>Tick Speed: </b></h6><p>Updates per second of the map</p>
                           <h6><b>Data Interval: </b></h6><p>Resolution of the data, 1=every data point, 2=every other data point</p>
                           <h6><b>Data Start: </b></h6><p>Timestamp of the data to start playback</p>
                           <h6><b>Data Points: </b></h6><p>Number of data points to cycle through after the start point</p>
                        </div>
                        <div style = {{minWidth: "10vw"}}/>
                    </div>
                </div>
            </div>

        );
    }
}
export default GoogleMapContainer;
