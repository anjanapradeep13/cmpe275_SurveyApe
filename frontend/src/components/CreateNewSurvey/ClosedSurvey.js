import React, {Component} from 'react';
import * as API from '../../api/API';
const queryString = require('query-string');

class ClosedSurvey extends Component {
    state={
        surveyTitle:'',
        questions:[],
        participants:[],
        options:[],
        surveyid: '2',
        formValid:false,
        qtype:[],
        newq:false,
        newp:false,
        endtime: ''
    };

    createNewSurvey(){
        var data={title:this.state.surveyTitle,questions:this.state.questions,endtime:this.state.endtime,
          options:this.state.options,qtype:this.state.qtype,participants:this.state.participants};
        API.createClosed(data)
            .then((output) => {
                console.log("CHECK THIS: "+output);
            });
    }

    nextQuestion(){
      this.setState({qtype: this.state.qtype.concat(this.refs.qt.value)});
      console.log("ch: "+this.refs.qt.value);
      this.setState({options: this.state.options.concat("BREAK")});
        console.log(this.state.questions);
        console.log(this.state.qtype);
        this.setState({newq:false});
        this.refs.ques.value="";
        this.refs.opt.value="";
    }

    nextOption(){
      console.log(this.state.options);
      this.refs.opt.value="";
      this.refs.opt.value="";
    }

    nextUser(){
        console.log(this.state.participants);
        this.setState({newp:false});
        this.refs.users.value="";
    }

    validateField(value) {
      this.setState({formValid: value.length !== 0});
    }

    validateQues(value,type) {
      this.setState({newq: value.length !== 0});
    }

    validatePar(value) {
      this.setState({newp: value.length !== 0});
    }

    validateOpt(value) {
      this.setState({newo: value.length !== 0});
    }

    render() {
        return (
            <div className="w3-container">
                <br/><br/>

                <h3 align="center">Create Closed Survey</h3>

                <form>
                    Survey Title: <input type="text" id="surveytitle" onChange={(event)=>{const value=event.target.value
                                             this.setState({surveyTitle: event.target.value}, () => { this.validateField(value) });}}/>
                    <br/><br/><br/>


                    Enter end: <input id="datetime" type="datetime-local" 
                                onChange={(event) => {this.setState({endtime: event.target.value});}}/>
                    <br/><br/><br/>

                    Enter question:
                    <input type="text" id="question" ref="ques" onBlur={(event)=>{
                        this.setState({questions: this.state.questions.concat(event.target.value)});}} onChange={(event)=>{const value=event.target.value
                                   this.setState(() => { this.validateQues(value) });}}/>

                                   <select ref="qt">
                                       <option value="text" defaultValue>Text</option>
                                       <option value="check">Checkbox</option>
                                       <option value="radio">Radio</option>
                                   </select>
                    <br/><br/>

                    Enter options:
                    <input type="text" id="option" ref="opt" onBlur={(event)=>{
                                             this.setState({options: this.state.options.concat(event.target.value)});}}
                                             onChange={(event)=>{const value=event.target.value
                                                        this.setState(() => { this.validateOpt(value) });}}/>
                    <button disabled={!this.state.newo} className="btn btn-default btn-sm" type="button" onClick={() => this.nextOption()}>Add next option</button>
                    <br/>
                    <button disabled={!this.state.newq} className="btn btn-default btn-sm" type="button" onClick={() => this.nextQuestion()}>Save & Add next</button>
                    <br/><br/>

                    Enter Participant:
                    <input type="text" id="users" ref="users" onInput={(event)=>{
                        this.setState({participants: this.state.participants.concat(event.target.value)});}} onChange={(event)=>{const value=event.target.value
                            this.setState(() => { this.validatePar(value) });}}/>
                    <button disabled={!this.state.newp} className="btn btn-default btn-sm" type="button" onClick={() => this.nextUser()}>Add next user</button>
                    <br/><br/><br/>

                    Save Survey: <button disabled={!this.state.formValid} className="btn btn-info" type="button" onClick={() => this.createNewSurvey(this.state)}>Save</button>
                </form>

            </div>
        );
    }
}

export default ClosedSurvey;
