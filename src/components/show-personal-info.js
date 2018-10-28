import React, { Component } from 'react';

import get from 'lodash/get';

import {
  getRelationshipByValue,
  buildRoutes
} from '../helpers/user-helper';

import { withRouter } from 'react-router-dom';

class ShowPersonalInfo extends Component {

  renderHeader(props, title, buttonName, url, id) {
    return (
      <div >
        <div>
          { title }
        </div>
        <button
          aria-label={ `${ buttonName } ${ title }` }
          onClick={() => props.history.push(url)} // TODO: Sample address. Ask for valid one
          id={`presonal_information_${id}`}
        >
            buttonName
          { buttonName }
        </button>
      </div>
    );
  }

  renderInformation(name = '', value = '') {
    return (
      <div>
        <div>
          { name }
        </div>
        {!value ? null :
        <div>
          { value }
        </div>
        }
      </div>
    );
  }

  renderEmergencyContact(props) {
    const emergencyContact = get(props, 'emergencyContacts[0]', {});
    const email = get(props, 'emergencyContacts[0].address.email', '');
    const { relationship: relationShipValue } = emergencyContact;
    const currentRelationship = getRelationshipByValue(relationShipValue);
    const relationshipDisplay = currentRelationship.display || '';

    return (
      <div>
        {this.renderHeader(
          props,
          'emergency_contact',
          'edit',
          // buildRoutes('emergency_contact_info_edit'),
          'edit-emergency-contact',
          'emergency_contact',
        )}
        { this.renderInformation('name', emergencyContact.name) }
        { this.renderInformation('phone_number', emergencyContact.dayPhone) }
        { this.renderInformation('email', email) }
        { this.renderInformation('relationship', relationshipDisplay) }
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div>
          { this.renderEmergencyContact(this.props) }
        </div>
      </div>
    );
  }
}

export default withRouter(ShowPersonalInfo);
