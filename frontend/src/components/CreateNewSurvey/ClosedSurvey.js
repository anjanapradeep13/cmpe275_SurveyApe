import React, {Component} from 'react';
import * as API from '../../api/API';
const queryString = require('query-string');

class ClosedSurvey extends Component {
    state={
        surveyTitle:'',
        questions:[],
    };

    createNewSurvey(){
        var data={title:this.state.surveyTitle,questions:this.state.questions};
        API.createGeneral(data)
            .then((output) => {
                console.log("CHECK THIS: "+output);
            });
    }

    nextQuestion(){
        console.log(this.state.questions);
        this.refs.ques.value="";
    }

    componentWillMount() {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed);
    }


    render() {
        return (
            <div className="w3-container">
                <br/><br/>

                <h3 align="center">Closed Survey</h3>

                <form>
                    Survey Title: <input type="text" id="surveytitle" onChange={(event)=>{
                    this.setState({surveyTitle: event.target.value});}}/><br/>
                    Enter question:
                    <input type="text" id="question" ref="ques" onBlur={(event)=>{
                        this.setState({questions: this.state.questions.concat(event.target.value)});}}/><br/>

                    <button className="button1" type="button" onClick={() => this.nextQuestion()}>Add next question</button><br/>
                    <br/><br/>
                    Submit Survey: <button className="button1" type="button" onClick={() => this.createNewSurvey(this.state)}>Submit</button>
                </form>

            </div>
        );
    }
}

export default ClosedSurvey;
