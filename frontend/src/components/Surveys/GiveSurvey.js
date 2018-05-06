import React, {Component} from 'react';
import * as API from '../../api/API';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';

const queryString = require('query-string');

class GiveSurvey extends Component {
    state = {
        surveyTitle: '',
        questions: [],
        surveyJSON: []
    };

    createSurveyJson(questions) {

        var surveyJSON = {};
        surveyJSON.questions = [];
        questions.forEach(function (value) {
            surveyJSON.questions.push({type: value.type, name: value.questionId, title: value.description})
        });
        console.log("SurveyJSON" + JSON.stringify(this.state));
        return surveyJSON.questions;

    }

    componentWillMount() {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed.id);
        console.log(parsed.user);

        if (parsed.user == null) {
            console.log(parsed.user + ": general");
            API.getGeneral(parsed.id)
                .then((output) => {
                    console.log("CHECK THIS: " + output.surveyId);
                    if (output) {
                        this.setState({surveyTitle: output.surveyTitle});
                        this.setState({questions: output.questions});
                        this.setState({survey: this.createSurveyJson(output.questions)});
                        console.log((this.state));
                    } else {
                        console.log("No data");
                    }
                });

        }

        else {
            console.log(parsed.user + ": closed");
            API.getClosed(parsed.id, parsed.user)
                .then((output) => {
                    console.log("CHECK THIS: " + output.surveyId);
                    if (output) {
                        this.setState({surveyTitle: output.surveyTitle, questions: output.questions});
                        this.setState({surveyJSON: this.createSurveyJson()});
                    } else {
                        console.log("No data");
                    }
                });
        }
    }


    render() {
        var json = { title: this.state.surveyTitle, showProgressBar: "top", pages: [
            {questions: this.state.survey},
            {questions: [
                { type: "matrix", name: "Quality", title: "Please indicate if you agree or disagree with the following statements",
                    columns: [{ value: 1, text: "Strongly Disagree" },
                        { value: 2, text: "Disagree" },
                        { value: 3, text: "Neutral" },
                        { value: 4, text: "Agree" },
                        { value: 5, text: "Strongly Agree" }],
                    rows: [{ value: "affordable", text: "Product is affordable" },
                        { value: "does what it claims", text: "Product does what it claims" },
                        { value: "better then others", text: "Product is better than other products on the market" },
                        { value: "easy to use", text: "Product is easy to use" }]},
                { type: "rating", name: "satisfaction", title: "How satisfied are you with the Product?",
                    mininumRateDescription: "Not Satisfied", maximumRateDescription: "Completely satisfied" },
                { type: "rating", name: "recommend friends", visibleIf: "{satisfaction} > 3",
                    title: "How likely are you to recommend the Product to a friend or co-worker?",
                    mininumRateDescription: "Will not recommend", maximumRateDescription: "I will recommend" },
                { type: "comment", name: "suggestions", title:"What would make you more satisfied with the Product?", }
            ]}
        ]};
        Survey
            .StylesManager
            .applyTheme("winterstone");
        var model = new Survey.Model(json);
        return (
            <div className="w3-container w3-panel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Survey.Survey model={model}/>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default GiveSurvey;
