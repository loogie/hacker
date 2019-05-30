import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createUser, loginUser, logout} from '../modules/socket';
import logo from './logo.svg';

import './App.scss';

class UserProfile extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            section: "login",
            username: null,
            pass: null,
            confirm: null
        }
    }
    switchSection(name){
        let state = this.state;
        state.section = name;
        this.setState(state);
    }
    update(prop, value){
        let state = this.state;

        state[prop] = value;

        console.log(state);

        this.setState(state);
    }

    render(){
        var user = false;
        if (this.props.user){
        user = true;
        }

        let loginClasses = "section";
        if (!this.props.user && this.state.section === "login"){
            loginClasses += " active";
        }

        let createClasses = "section";
        if (!this.props.user && this.state.section === "create"){
            createClasses += " active";
        }

        let userProfileClasses = "section";
        if (this.props.user){
            userProfileClasses += " active";
        }

        let match = (this.state.pass === this.state.confirm);
        let pwdClasses = "row";
        if(match){
            pwdClasses += " hide";
        }

        return (
        <div className="user-profile">
            <div className={loginClasses}>
                <div className="row"><div className="fill">Username:</div> <input type="text"  onChange={(e)=>this.update('username', e.target.value)} /></div>
                <div className="row"><div className="fill">Password:</div> <input type="password" onChange={(e)=>this.update('pass', e.target.value)} /></div>
                <div  className="row">
                    <div className="fill"></div>
                    <button onClick={()=>this.switchSection('create')}>Create</button>
                    <button onClick={()=>this.props.loginUser({name: this.state.username, pass:this.state.pass})}>
                        Login
                    </button>
                </div>
            </div>
            <div className={createClasses}>
            <div className="row"><div className="fill">Username:</div> <input type="text"  onChange={(e)=>this.update('username', e.target.value)} /></div>
                <div className="row"><div className="fill">Password:</div> <input type="password" onChange={(e)=>this.update('pass', e.target.value)} /></div>
                <div className="row"><div className="fill">Confirm:</div> <input type="password" onChange={(e)=>this.update('confirm', e.target.value)} /></div>
                <div className={pwdClasses}>Password and Confirm do not match.</div>
                <div  className="row">
                    <div className="fill"></div>
                    <button onClick={()=>this.switchSection('login')}>Login</button>
                    <button disabled={!match} onClick={()=>this.props.loginUser({name: this.state.username, pass:this.state.pass})}>
                        Create
                    </button>
                </div>
            </div>
            <div className={userProfileClasses}>
                <div>User Profile</div>
                <button onClick={()=>this.props.logout()}>
                    Logout
                </button>
            </div>
            
        </div>
        );
    }
}

const mapStateToProps = state =>{
  return {
    connected: state.socket.connected,
    user: state.socket.user
  }
}

const mapDispatchToProps = dispatch =>bindActionCreators({
  createUser, loginUser, logout
}, 
dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);