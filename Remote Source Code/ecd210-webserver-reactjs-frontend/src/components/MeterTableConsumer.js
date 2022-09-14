import React, { Component } from 'react'
import MeterMapForm from './MeterMapForm'

class MeterTable extends Component{
    constructor(props){
        super(props);
    }
	  state = {
        meters: [],
        cur_meter: 1,
        cur_meter_data: [],
        display_range_start: 0,
        display_range_end: 24
    }

    getData = async () => {
        const api_call = await fetch(this.props.server+"getMeterList").catch()
        const ret_data1 = await api_call.json();
        var meter_number = 1;
        var data = {meter_id: meter_number}
        const api_call2 = await fetch(this.props.server+"getMeterData", {
          method: 'post',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const ret_data2 = await api_call2.json();
        this.setState({
            meters: ret_data1,
            cur_meter: 1,
            cur_meter_data: ret_data2
        })
        this.props.setParentState(ret_data1)
    }
    getMeterData = async (e) => {
      var meter_number = parseInt(e.target.name.substring(e.target.name.indexOf(' '))) + 1;
      var data = {meter_id: meter_number}
      const api_call = await fetch(this.props.server+"getMeterData", {
        method: 'post',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const ret_data = await api_call.json();
      this.setState({
        meters: this.state.meters,
        cur_meter: meter_number,
        cur_meter_data: ret_data
      })
      this.props.setParentState({
        meters: this.state.meters
      })
      console.log(ret_data);
    }
    render(){
        return (
	    <div>
                <table>
                  <thead>
                    <tr>
                      <th>Time Stamp</th>
                      <th>Real Power Avg</th>
                      <th>Reactive Power Avg</th>
                      <th>Voltage Avg</th>
                      <th>Current Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.cur_meter_data.map((e, i) => {
                        if(i >= this.state.display_range_start && i <= this.state.display_range_end){
                          return(
                            <tr key = {i.toString()}>
                              <td>{e.timestamp}</td>
                              <td>{e.realPowerAvg}</td>
                              <td>{e.reactivePowerAvg}</td>
                              <td>{e.voltageAvg}</td>
                              <td>{e.currentAvg}</td>
                            </tr>
                          )
                        }
                      })
                    }
                  </tbody>
                </table>
            </div>

        );
    }
}

export default MeterTable;
