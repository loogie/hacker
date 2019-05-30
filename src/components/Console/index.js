import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import {createUser, loginUser, logout} from '../modules/socket';

import './style.scss';

class Console extends React.Component {
    
    constructor(props){
        super(props);

        this.state = {
            consoleName:"Test1",
            focused:false,
            inputText:""
        };
    }

    type(text){
        let state = this.state;
        state.inputText = text;
        console.log(this.state);
        this.setState(state);
    }

    clickArea(e){
        this[this.state.consoleName].focus();

        console.log("ACTIVE");
        console.log(this.activeElement)
    }

    focusChange(val){
        let state = this.state;
        state.focused = val;

        console.log(state);
        this.setState(state);
    }

    render(){
        var tmpLines = [
            {text: "History"},
            {text: "In"},
            {text: "Lines"}
        ];

        return (
            <div className="fill-screen">
                <div className="terminal" onClick={(e)=>this.clickArea(e)}>
                    <div className="lines">
                        <div>History</div>
                        <div>In</div>
                        <div>Lines</div>
                        
                    </div>
                    <input ref={(input) => { this[this.state.consoleName] = input; }} className="hidden-input" onChange={(e)=>this.type(e.target.value)} onFocus={()=>this.focusChange(true)} onBlur={()=>this.focusChange(false)} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state =>{
  return {
    //connected: state.socket.connected,
    //user: state.socket.user
  }
}

const mapDispatchToProps = dispatch =>bindActionCreators({
  //createUser, loginUser, logout
}, 
dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Console);