import React, { Component } from 'react';

// import get from 'lodash/get';

import Routes from './routes/routes';

// import {
//   getRelationshipByValue,
//   buildRoutes
// } from './helpers/user-helper';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Routes></Routes>
      </div>
    );
  }
}

export default App;
