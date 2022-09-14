import React, {Component} from 'react';

class CreateAccount extends Component {

  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  state = {
    error: ""
  }
  onSubmit = async (event) =>{
      event.preventDefault();
      const username = event.target.elements.username.value;
      const password = event.target.elements.password.value;
      const level = event.target.elements.level.value;

      const data = {
        username: username,
        password: password,
        level: level
      }
      console.log(data);
      JSON.stringify(data);

      const api_call = await fetch('http://127.0.0.1:3001/createAccount', {

        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch();
      const retData = await api_call.json();
      if(retData.error){
        this.setState({
          error: retData.error
        });
      }else{
        console.log(retData)
        this.props.updateUserLevel(retData.level, retData.id);
      }
      console.log(retData);
  }
  render(){
    return(
        <div className = "accountForm">
          <h1>Create an Account</h1>
          <form onSubmit={this.onSubmit}>
              <label htmlFor="username">Enter username</label>
              <br/>
              <input id="username" name="username" type="text" />
              <br/>
              <label htmlFor="password">Enter your password</label>
              <br/>
              <input id="password" name="password" type="password" />
              <br/>
              <label htmlFor="level">Enter Account Level (0,1,2) -> (Consumer, Utility, Admin)</label>
              <br/>
              <input id = "level" name = "level" type = "text"/>
              <br/>
              <p style = {{color: "red"}}>{this.state.error}</p>
              <button>Create Account</button>
          </form>
        </div>
    );
  }
}

export default CreateAccount;
