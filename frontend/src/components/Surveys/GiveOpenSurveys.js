import React, {Component} from 'react';
import * as API from '../../api/API';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import $ from 'jquery';
import 'jquery-bar-rating';
import 'jquery-bar-rating/dist/themes/css-stars.css';
import 'survey-react/survey.css';
import * as widgets from 'surveyjs-widgets';
window["$"] = window["jQuery"] = $;

const queryString = require('query-string');

class GiveOpenSurveys extends Component {
    state = {
        surveyId: '',
        surveyTitle: '',
        questions: [],
        surveyJSON: []
    };

    createSurveyJson(questions) {
        console.log(questions);

        var surveyJSON = {};
        surveyJSON.questions = [];
        questions.forEach(function (value) {

            if (value.type == "checkbox") {
                var choices1 = [];
                var optionId = [];
                value.options.forEach(function (option) {
                    choices1.push(option.description);
                    optionId.push(option.optionId);

                });
                surveyJSON.questions.push({
                    type: value.type,
                    name: value.questionId,
                    title: value.description,
                    colCount: 4,
                    choices: choices1,
                    optionId: optionId
                })

            }
            else if (value.type == "radiogroup" || value.type == "yesNo") {
                var choices1 = [];
                var optionId = [];
                value.options.forEach(function (option) {
                    choices1.push(option.description);
                    optionId.push(option.optionId);
                });
                surveyJSON.questions.push({
                    type: "radiogroup",
                    name: value.questionId,
                    title: value.description,
                    isRequired: true,
                    colCount: 4,
                    choices: choices1,
                    optionId: optionId
                })

            }
            else if (value.type == "barrating") {

                surveyJSON.questions.push({
                    type: value.type,
                    name: value.questionId,
                    title: value.description,
                    ratingTheme: "css-stars",
                    choices: ["1", "2", "3", "4", "5"]
                });
            }
            else if (value.type == "dropdown") {
                var choices1 = [];
                value.options.forEach(function (option) {
                    choices1.push(option.description);

                });
                surveyJSON.questions.push({
                    type: value.type,
                    name: value.questionId,
                    title: value.description,
                    colCount: 0,
                    choices: choices1
                });
            }
            else if(value.type == "image"){
                var choices1 = [];

                value.options.forEach(function (option) {
                    choices1.push({value: option.optionId, text: "![A] ("+option.description+" =100x75)"});
                });
                surveyJSON.questions.push({

                    type: "radiogroup",
                    name: value.questionId,
                    "hasOther": false,
                    title: value.description,
                    choices: choices1
                });
            }
            else
                surveyJSON.questions.push({type: value.type, name: value.questionId, title: value.description})
        });
        console.log("SurveyJSON" + JSON.stringify(surveyJSON.questions));
        return surveyJSON.questions;
    }

    surveySendResult = function (sender) {

        var data = {
            surveyId: this.state.surveyId
        };
        API.saveSurvey(data)
            .then((output) => {
                console.log("CHECK THIS: " + output);
            });

    };

    surveyValueChanged = function (sender, options) {
        var mySurvey = sender;
        var questionName = options.name;
        var newValue = options.value;
        if (options.value) {
            console.log(questionName + " " + newValue);
            var data = {
                surveyId: this.state.surveyId,
                questions: options.name,
                response: options.value.toString()
            }
            API.saveOpenResponse(data)
                .then((output) => {
                    console.log("CHECK THIS: " + output);
                });
        }


    };

    componentWillMount() {
        widgets.jquerybarrating(Survey);
        this.setState({surveyId: this.props.survey.surveyId});
        this.setState({surveyTitle: this.props.survey.surveyTitle, questions: this.props.questions});
        this.setState({survey: this.createSurveyJson(this.props.questions)});
        console.log("state in get open: " + this.state);
    }


    render() {
        var json = {
            title: this.state.surveyTitle, showProgressBar: "top", pages: [
                {questions: this.state.survey}
            ]
        };
        Survey
            .StylesManager
            .applyTheme("winterstone");
        var model = new Survey.Model(json);

        var showdown  = require('showdown')
        var converter = new showdown.Converter();
        model
            .onTextMarkdown
            .add(function (model, options) {
                var str = converter.makeHtml(options.text);
                str = str.substring(3);
                str = str.substring(0, str.length - 4);
                options.html = str;
            });


        return (
            <div className="w3-container w3-panel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Survey.Survey model={model} onComplete={this.surveySendResult.bind(this)}
                                           onValueChanged={this.surveyValueChanged.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default GiveOpenSurveys;
