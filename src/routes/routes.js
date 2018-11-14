import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import EditEmergencyContactsInformation from '../components/forms/edit-emergency-contacts/edit-emergency-contacts';
import EssayComponent from '../components/forms/essay-component/essay-component';
import HomeComponent from '../components/home-component/home-component';
import CreatePersonForm from '../components/forms/create-person/create-person';

import { EditEmergencyContactInfoView } from '../components/juice-forms/profile/profile-formviews'

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
            <Route exact path={'/xevo-form-edit-emergency-contacts'} component={EditEmergencyContactInfoView} />
            <Route path={'/essay'} component={EssayComponent} />
            <Route path={'/edit-emergency-contacts'} component={EditEmergencyContactsInformation} />
            <Route path={'/create-person'} component={CreatePersonForm} />
            <Route path={'/'} component={HomeComponent} />
            {/* <Route path={'/'} component={ShowPersonalInformation} /> */}
          </Switch>
        </Router>
      );
    }
  }