import React, { Component } from 'react'

class ConsumerInterfaceSubSection extends Component{
    constructor(props){
        super(props);
    }
	
    state = {
        display_range_start: 0,
        display_range_end: 24
    }
    decreaseMeterRange = () => {
      if(this.state.display_range_start - 25 < 0){
          this.setState({
          display_range_start: 0,
          display_range_end: 24
          })
      }else{
          this.setState({
            display_range_start: this.state.display_range_start - 25,
            display_range_end: this.state.display_range_end - 25
          })
      }
    }
    increaseMeterRange = () => {
      if(this.state.display_range_start + 25 < this.props.data.length){
          this.setState({
          display_range_start: this.state.display_range_start + 25,
          display_range_end: this.state.display_range_end + 25
          })
      }
    }
    
    render(){
        return (//Need to make a table for every meter mapped to this user
            <div className = {"utilityInterface"}>
                <p className = {"subHeader"}>Meter {this.props.meterID}</p>
                <span>Entries {this.state.display_range_start} - {this.state.display_range_end}</span>
                <br/>
                <button onClick = {this.decreaseMeterRange}>Previous</button>
                <button onClick = {this.increaseMeterRange}>Next</button>
                <table>
                    <thead>
                        <tr>
                            <th>Time Stamp</th>
                            <th>Minimum Power</th>
                            <th>Maximum Power</th>
                            <th>Average Power</th>   
                            <th>Energy</th>
                        </tr>
                    </thead>
                    <tbody> 
                    {this.props.data.map((e, i) => {
                        if(i >= this.state.display_range_start && i <= this.state.display_range_end){
                          return(
                            <tr key = {i.toString()}>
                              <td>{e.timestamp}</td>
                              <td>{e.realPowerMin}</td>
                              <td>{e.realPowerMax}</td>
                              <td>{e.realPowerAvg}</td>
                              <td>{e.energy}</td>
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

export default ConsumerInterfaceSubSection;