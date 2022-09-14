/*
  Default JS imports
  Tab logo
  Default css for App
*/

import React, {Component} from 'react';
import logo from './logo.svg'; // This is the tab logo
import './App.css'; // Default App CSS
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

/*

  The webpage is broken down into different files that make up the full app.
  They are imported below.
- JT

*/

import Header from './components/Header';
import NavBar from './components/NavBar';
import TableEntry from './components/TableEntry'
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import AccountView from './components/AccountView';
import UtilityInterface from './components/UtilityInterface';
import ConsumerInterface from './components/ConsumerInterface';

const SERVER = "http://127.0.0.1:3001/"
class App extends Component {
  state = {
    loginLevel: -1,
    userID: -1
  }
  updateUserLevel = (level, userID) => {
    this.setState({
      loginLevel: level,
      userID: userID
    });
  }
  render(){
    if(this.state.loginLevel == -1){//Display login/create interface
      return(
      <Router>
        <div className = "App">
          <Header/>
          <NavBar />
          <Route path = "/signup"><CreateAccount updateUserLevel = {this.updateUserLevel}/></Route>
          <Route path = "/login"><Login updateUserLevel = {this.updateUserLevel}/></Route>
          <Route path = "/accounts"><AccountView server = {SERVER}/></Route>

        </div>
      </Router>
      );
  }else if(this.state.loginLevel == 0){//Display Consumer Interface
      return(
        <Router>
          <div className = "App">
            <Header/>
            <br/>
            <ConsumerInterface userID = {SERVER}/>
          </div>
        </Router>
      )
  }else if(this.state.loginLevel == 1){ //Display Utility Interface
      return(
        <Router>
          <div className = "App">
            <Header/>
            <br/>
            <UtilityInterface server = {SERVER}/>
          </div>
        </Router>
      )
    }else{//Display Admin Interface
      return(
        <Router>
          <div className = "App">
            <Header/>
            <p>Admin Interface</p>
          </div>
        </Router>
      )
    }
    return(
      <div>Logged In</div>
    )
  }
}

export default App;
