import React from 'react';
import { Link } from 'react-router-dom';

class HomeComponent extends React.Component {

  render() {
    return (
      <div>
        <div>
          <h1>XevoForm Examples</h1>
          <ul>
            <li>
              <Link to="/xevo-form-edit-emergency-contacts">Edit Emergency Contacts</Link>
            </li>
          </ul>
        </div>

        <div>
          <h1>Juice Form Examples</h1>
          <ul>
            <li>
              <Link to="/essay">Create a new Essay</Link>
            </li>
            <li>
              <Link to="/edit-emergency-contacts">Edit Several Emergency Contacts</Link>
            </li>
            <li>
              <Link to="/create-person">Create Person</Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }

}

export default HomeComponent;