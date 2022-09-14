import React, { Component } from 'react'
class AccountView extends Component{
    constructor(props){
        super(props);
      }
	state = {
        users: [],
    }
    getName = async(e) => {
        const api_call = await fetch(this.props.server+"getUsers").catch()
        const data = await api_call.json();
        this.setState({
            users: data
        })
        console.log(this.state.users);
    }
    clearData = async (e) => {
        const api_call = await fetch(this.props.server+"clearData").catch()
        const data = await api_call.json();
        this.setState({
            users: data
        })
    }
    componentDidMount(){
      this.getName();
    }
    render(){
        return (
            <div>
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Username</th>
                      <th>Account Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.users.map((e, i) => {
                      return(
                        <tr key={e.id}>
                          <td>{e.id}</td>
                          <td>{e.username}</td>
                          <td>{e.level}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <button onClick = {this.clearData}>Remove All Users</button>
            </div>

        );
    }
}

export default AccountView;
