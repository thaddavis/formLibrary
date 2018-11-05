import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ShowPersonalInformation from '../components/show-personal-info';
import EditEmergencyContactsInformation from '../components/edit-emergency-contacts/edit-emergency-contacts';
import EssayComponent from '../components/essay-component/essay-component';
import HomeComponent from '../components/home-component/home-component';
import CreatePersonComponent from '../components/create-person-component/create-person-component';

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
            <Route path={'/essay'} component={EssayComponent} />
            <Route path={'/edit-emergency-contacts'} component={EditEmergencyContactsInformation} />
            <Route path={'/create-person'} component={CreatePersonComponent} />
            <Route path={'/'} component={HomeComponent} />
            {/* <Route path={'/'} component={ShowPersonalInformation} /> */}
          </Switch>
        </Router>
      );
    }
  }