import React from 'react';

import { Switch } from 'react-router-dom';

import Route from './Route';

import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import VisitForm from '../pages/VisitForm';
import Menu from '../pages/Menu';
import CondonMenu from '../pages/CondonMenu';
import Agendamento from '../pages/Agendamento';
import Registrar from '../pages/Registrar';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Menu} />
    <Route path="/registrar" component={Registrar} />

    <Route path="/condon-menu/:apto" component={CondonMenu} />
    <Route path="/condon-agend/:apto" component={Agendamento} />
    <Route path="/visit-form/:visita_uid" component={VisitForm} />

    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/dashboard" component={Dashboard} />
  </Switch>
);

export default Routes;
