import React, {Component} from 'react';
import * as API from '../../api/API';
import { Base64 } from 'js-base64';

const queryString = require('query-string');

class EditSurvey extends Component {
    state = {
        surveys: [],
        visible: false,
        surId: '',
        surTy: ''
    };


    componentWillMount() {
        API.allSurveys()
            .then((output) => {
                if (output!=false) {
                    this.setState({surveys: output});
                } else {
                    console.log("No data");
                    alert("No surveys found!");
                }
            });
    }

    handleEdit = (sid, ty) => {
        console.log("edit id: " + sid);
        console.log("edit type: " + ty);
        this.setState({surId: sid, surTy: ty});
        this.setState({visible: !this.state.visible});
    };

    handleExport=(surDeatils) =>{
      console.log(surDeatils.questions);
      var jsoncontent=surDeatils.questions;
      for(var i=0;i<jsoncontent.length;i++){
          delete jsoncontent[i].questionId;
          delete jsoncontent[i].surveyId;
          delete jsoncontent[i].answers;
          for(var j=0;j<(jsoncontent[i].options).length;j++){
            delete jsoncontent[i].options[j].optionId;
            delete jsoncontent[i].options[j].questionId;
          }
        }
      var element = document.createElement("a");
      var file = new Blob([JSON.stringify(jsoncontent)], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "surveyExport.txt";
      element.click();
    }


    render() {
        return (
            <div className="w3-container">
                <br/><br/>
                <h3 align="center">Edit Survey</h3>
                <br/><br/>
                <div className="col-xxs-12 col-xs-12 mt">
                    <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1 mt"></div>
                    <div className="col-sm-3 col-md-3 col-lg-3 col-xs-3 mt">
                        <b>Survey Title</b>
                    </div>
                </div>
                <br/><br/>

                {this.state.surveys.map(s => {
                    return (
                        <div className="col-xxs-12 col-xs-12 mt" key={Math.random()}>
                            <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1 mt"></div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xs-3 mt">
                                <b>{(s.surveyTitle)}</b>
                            </div>
                          { (s.closed==1) ?
                            (<div>
                              <div className="col-sm-2 col-md-2 col-lg-2 col-xs-2 mt">
                                  <button disabled={true} className="btn btn-warning" type="button"
                                          onClick={() => this.handleEdit(s.surveyId, s.type)}>Edit
                                  </button>
                              </div>
                              <div className="col-sm-2 col-md-2 col-lg-2 col-xs-2 mt">

                                  <button className="btn btn-info" type="button"
                                          onClick={() =>this.handleExport(s)}>Export</button>
                              </div>
                              <br/><br/></div>
                            ):
                            (<div>
                              <div className="col-sm-2 col-md-2 col-lg-2 col-xs-2 mt">
                                  <button className="btn btn-warning" type="button"
                                          onClick={() => this.handleEdit(s.surveyId, s.type)}>Edit
                                  </button>
                              </div>
                              <div className="col-sm-2 col-md-2 col-lg-2 col-xs-2 mt">
                                  <button className="btn btn-info" type="button"
                                          onClick={() =>this.handleExport(s)}>Export</button>
                              </div>
                              <br/><br/></div>
                            )
                          }

                        </div>
                    )
                })
                }

                <div>
                    {
                        this.state.visible
                            ? <EditForm sid={this.state.surId} st={this.state.surTy}/>
                            : null
                    }
                </div>

            </div>
        );
    }
}


class EditForm extends Component {
    state = {
        questions: [],
        qtype: [],
        participants: [],
        options:[],
        newq: false,
        newo: false,
        newp: false
    };

    editSurvey() {
        var data = {
            title: '',
            questions: this.state.questions,
            qtype: this.state.qtype,
            options:this.state.options,
            participants: this.state.participants
        };
        API.editSurvey(data, this.props.sid)
            .then((output) => {
                console.log("CHECK THIS: " + output);
                alert("Survey updated!");
            });
    }

    nextQuestion() {
      this.setState({qtype: this.state.qtype.concat(this.refs.qt.value)});
      this.setState({options: this.state.options.concat("BREAK")});

        this.setState({newq: false});
        this.setState({newo: false});
        this.setState({temp: []});
        this.refs.ques.value = "";
        this.refs.opt.value = "";
    }

    nextUser() {
        console.log(this.state.participants);
        this.setState({newp: false});
        this.refs.users.value = "";
    }

    nextOption() {
        console.log(this.state.options);
        this.setState({newo: false});
        this.refs.opt.value = "";
    }

    nextImage() {
        var imgname = (this.refs.img.value).substring((this.refs.img.value).lastIndexOf("\\") + 1);
        console.log("New file name: "+imgname);
        imgname="/Users/anjana/Desktop/cmpe275_SurveyApe/uploads/"+imgname;
        this.setState({options: this.state.options.concat(imgname)});
        console.log(this.state.options);
        this.setState({newimg: false});
        this.refs.img.value = "";
    }

    validatePar(value) {
        this.setState({newp: value.length !== 0});
    }

    validateQues(value) {
        this.setState({newq: value.length !== 0});
    }

    validateOpt(value) {
        this.setState({newo: value.length !== 0});
    }

    handleUpload = (event) => {
      this.setState({newimg: event.target.files.length !== 0});
      const payload=new FormData();
      payload.append('file', event.target.files[0]);
        API.uploadimage(payload)
            .then((output) => {
                if (output === 1) {
                  this.setState({uploadstatus: 'File uploaded.'});
                    console.log("File uploaded");
                } else {
                  this.setState({uploadstatus: 'File not uploaded.'});
                    console.log("File not uploaded");
                }
            });
    };

    importQuestions= files => {
      var contentString = Base64.decode(files.base64);
      contentString=contentString.substring(contentString.indexOf('['))
      console.log("file string: "+contentString);
      var contentJson=JSON.parse(contentString);
      console.log("file json len: "+contentJson.length);
      for(var i=0;i<contentJson.length;i++){
        console.log(contentJson[i].description);
        this.setState({questions: this.state.questions.concat(contentJson[i].description)});
        this.setState({qtype: this.state.qtype.concat(contentJson[i].type)});
        for(var j=0;j<(contentJson[i].options).length;j++){
          this.setState({options: this.state.options.concat(contentJson[i].options[j].description)});
        }
        if((contentJson[i].options).length>0)
        this.setState({options: this.state.options.concat("BREAK")});
      }
      console.log("options: "+this.state.options);
      console.log("question: "+this.state.questions);
      console.log("question: "+this.state.qtype);
    }

    render() {
        return (
            <div>
                <br/><br/><br/><br/><br/>
                Add questions/participants
                <br/><br/>
                <form>
                    Enter question:
                    <input type="text" id="question" ref="ques" onBlur={(event) => {
                        this.setState({questions: this.state.questions.concat(event.target.value)});
                    }} onChange={(event) => {
                        const value = event.target.value
                        this.setState(() => {
                            this.validateQues(value)
                        });
                    }}/>
                    <select ref="qt">
                    <option value="text" defaultValue>Text</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radiogroup">Radio</option>
                    <option value="comment">Text Area</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="barrating">Ratings</option>
                    </select>
                    <br/><br/>

                    Enter options:
                    <input type="text" id="option" ref="opt" onBlur={(event)=>{
                                             this.setState({options: this.state.options.concat(event.target.value)});}}
                                             onChange={(event)=>{const value=event.target.value
                                                        this.setState(() => { this.validateOpt(value) });}}/>
                    <button disabled={!this.state.newo} className="btn btn-default btn-sm" type="button" onClick={() => this.nextOption()}>Save & Add next option</button>
                    <br/>

                    <button disabled={!this.state.newq} className="btn btn-default btn-sm" type="button"
                            onClick={() => this.nextQuestion()}>Save & Add next</button>
                    <br/><br/>

                    {
                        this.props.st !== 3 ? (<div>
                            Enter user: <input type="text" id="users" ref="users" onBlur={(event) => {
                            this.setState({participants: this.state.participants.concat(event.target.value)});
                        }} onChange={(event) => {
                            const value = event.target.value
                            this.setState(() => {
                                this.validatePar(value)
                            });
                        }}/>
                            <button disabled={!this.state.newp} className="btn btn-default btn-sm" type="button"
                                    onClick={() => this.nextUser()}>Save & Add next participant
                            </button>
                            <br/><br/><br/></div>) : null}

                    <button className="btn btn-success" type="button" onClick={() => this.editSurvey()}>Save Survey</button>
                </form>

            </div>
        );
    }
}

export default EditSurvey;
