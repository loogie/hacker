import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {socketConn} from '../modules/socket';
import UserProfile from './UserProfile';

import logo from './logo.svg';
import './App.scss';

class App extends React.Component {
  constructor(props){
    super(props);

    this.props.socketConn();
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            This is the timer value: {this.props.timer}
          </p>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <UserProfile />
        </header>
      </div>
    );
  }
}

const mapStateToProps = state =>{
  return {
  }
}

const mapDispatchToProps = dispatch =>bindActionCreators({
  socketConn
}, 
dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(App);