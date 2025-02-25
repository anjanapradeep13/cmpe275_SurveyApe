import React, {Component} from 'react';
import { Route, Link} from 'react-router-dom';
import GeneralSurvey from './GeneralSurvey';
import ClosedSurvey from './ClosedSurvey';
import OpenSurvey from './OpenSurvey';

class Home extends Component {

  state={
    visibleGeneral:false,
    visibleClosed:false,
    visibleOpen:false
  }

  generalShow() {
    this.setState({visibleGeneral: !this.state.visibleGeneral,visibleClosed: false,visibleOpen: false});
  }

  closedShow() {
    this.setState({visibleClosed: !this.state.visibleClosed,visibleGeneral: false,visibleOpen: false});
  }

  openShow() {
    this.setState({visibleOpen: !this.state.visibleOpen,visibleClosed: false,visibleGeneral: false});
  }



    render() {
        return (
          <div className="w3-container">
          <br/>

          <div className="col-xxs-12 col-xs-12 mt">
          <div className="col-sm-1 col-md-1 col-lg-1"></div>

          <div className="col-sm-3 col-md-3 col-lg-3 col-xs-4 mt">
          <button type="button" className="btn btn-primary btn-block"
                  value="General" onClick={() => this.generalShow()}>General Survey</button>
          </div>

          <div className="col-sm-3 col-md-3 col-lg-3 col-xs-4 mt">
          <button type="button" className="btn btn-primary btn-block"
                  value="Closed" onClick={() => this.closedShow()}>Closed Survey</button>
          </div>

          <div className="col-sm-3 col-md-3 col-lg-3 col-xs-4 mt">
          <button type="button" className="btn btn-primary btn-block"
                  value="Open" onClick={() => this.openShow()}>Open Survey</button>
          </div>

          </div>

          {/* div to display general survey */}
          <div>
            {
              this.state.visibleGeneral
                ? <GeneralSurvey/>
                : null
            }
          </div>

          {/* div to display closed survey */}
          <div>
              {
                  this.state.visibleClosed
                      ? <ClosedSurvey/>
                      : null
              }
          </div>

          {/* div to display open survey */}
          <div>
          {
              this.state.visibleOpen
                  ? <OpenSurvey/>
                  : null
          }
          </div>

         </div>
        );
    }
}

export default Home;
