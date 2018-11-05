import React from 'react';
import { Link } from 'react-router-dom';

class HomeComponent extends React.Component {

  render() {
    return (
      <div>
        <h1>XevoForm</h1>
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
    )
  }

}

export default HomeComponent;