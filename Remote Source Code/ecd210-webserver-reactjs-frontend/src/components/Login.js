import React, {Component} from 'react';

class Login extends Component {

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

      const data = {
        username: username,
        password: password
      }
      console.log(data);
      JSON.stringify(data);
      
      const api_call = await fetch('http://127.0.0.1:3001/login', {
        method: 'post', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch();
      const retData = await api_call.json();
      console.log(retData);
      console.log(retData);
      if(retData.error){
        this.setState({
          error: retData.error
        });
      }else{
        console.log(retData)
        this.props.updateUserLevel(retData.level, retData.id);
      }
      
  }
  render(){
    return(
        <div className = "accountForm">
          <h1>Login</h1>
          <form onSubmit={this.onSubmit}>
              <label htmlFor="username">Enter username</label>
              <br/>
              <input id="username" name="username" type="text" />
              <br/>
              <label htmlFor="password">Enter your password</label>
              <br/>
              <input id="password" name="password" type="password" />
              <br/>
              <p style = {{color: "red"}}>{this.state.error}</p>
              <button>Login</button>
          </form>
        </div>
    );
  }
}

export default Login;