import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ShowPersonalInformation from '../components/show-personal-info';
import EditEmergencyContactsInformation from '../components/edit-emergency-contact';

export default class MainRoutes extends Component {
    constructor(props) {
      super(props);
      this.store = props.store;
      this.history = createHistory();
    }
  
    componentWillMount() {
      // this.init();
    }
  
    render() {
      return (
        <Router history={this.history} >
          <Switch>
            <Route path={'/edit-emergency-contact'} component={EditEmergencyContactsInformation} />
            <Route path={'/'} component={ShowPersonalInformation} />
          </Switch>
        </Router>
      );
    }
  }