import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createCursor, updateInput, enterCommand} from '../../modules/console';
import {Caret} from './Cursors';

import './style.scss';

class Console extends React.Component {
    
    constructor(props){
        super(props);

        this.state = {
            consoleName:"Test1",
            focused:false,
            prevIndex: -1
        };

        this.props.createCursor(new Caret("caret", 5, {current:0, tags:['', '_']}));
        this.props.createCursor(new Caret("spinner", 2, {current:0, tags:['|', '/', '-', '\\']}));
        this.props.createCursor(new Caret("dots", 5, {current:0, tags:['', '.', '..', '...']}));
    }

    clickArea(e){
        this[this.state.consoleName].focus();
    }

    focusChange(val){
        let state = this.state;
        state.focused = val;

        this.setState(state);
    }

    keyPress(e){
        let input = this.props.input;
        if (e.key === 'Enter'){
            let state = this.state;
            state.lineIndex = -1;
            this.setState(state);
            this.props.enterCommand(input);
            input = "";
        }
        else if (e.key === 'ArrowUp'){
            if (this.state.lineIndex === -1){
                let state = this.state;
                state.lineIndex = this.props.lines.length - 1;

                this.setState(state);
                
                input = this.props.lines[state.lineIndex].text;
            }
            else {
                let state = this.state;
                state.lineIndex--;
                if (state.lineIndex < 0){
                    state.lineIndex = 0;
                }

                this.setState(state);
                
                input = this.props.lines[state.lineIndex].text;
            }
        }
        else if (e.key === 'ArrowDown'){
            if (this.state.lineIndex !== -1 && this.state.lineIndex < this.props.lines.length -1 ){
                let state = this.state;
                state.lineIndex++;
                this.setState(state);

                input = this.props.lines[state.lineIndex].text;
                e.currentTarget.value = "";
            }
        }
        else if (e.key === "Space"){
            input += ' tes';
        }
        else {
            let state = this.state;
            state.lineIndex = -1;
            this.setState(state);

            input += e.currentTarget.value;
            e.currentTarget.value = "";
        }
        
        this.props.updateInput(input);
    }

    renderText($txt){
       
        return (
            $txt.replace(' ', '&nbsp;')
        );
    }

    render(){
        var cursors = this.props.cursors;

        var lines = this.props.lines;//.replace(' ', '&nbsp;');

        var lineDivs = lines.map((line, i)=>{
            let txt = line.text.replace(' ', '&nbsp;');
            return <div key={i}>{txt}</div>
        });

        return (
            <div className="fill-screen">
                <div className="terminal" onClick={(e)=>this.clickArea(e)}>
                    <div className="lines">
                        {lineDivs}
                        <div className="home">
                            <div>prefix >: </div>
                            <div>{this.props.input}</div>
                            <div>{(cursors['caret'])?cursors['caret'].tag:''}</div>
                        </div>
                    </div>
                    <input ref={(input) => { this[this.state.consoleName] = input; }} className="hidden-input" onFocus={()=>this.focusChange(true)} onBlur={()=>this.focusChange(false)} onKeyUp={(e)=>this.keyPress(e)} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        input: state.console.input,
        lines: state.console.lines,
        timer: state.console.timer,
        cursors: state.console.cursors
    }
}

const mapDispatchToProps = dispatch =>bindActionCreators({
  createCursor, updateInput, enterCommand
}, 
dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Console);