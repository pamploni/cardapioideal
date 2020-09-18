import React from 'react';

import { Switch } from 'react-router-dom';

import Route from './Route';

import Menu from '../pages/Menu';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Menu} />
    <Route path="/menu/:cliente_cname" component={Menu} />
  </Switch>
);

export default Routes;
