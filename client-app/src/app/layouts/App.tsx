import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { Route, Switch, useLocation } from 'react-router-dom';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import NavBar from './NavBar';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerSideError from '../../features/errors/ServerSideError';
import ModalContainer from '../modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

export default observer(function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />

      <Route exact path='/' component={HomePage} />
      <Route
        path='/(.+)'
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path='/test-errors' component={TestErrors} />
                <PrivateRoute
                  exact
                  path='/activities'
                  component={ActivitiesDashboard}
                />

                <PrivateRoute
                  exact
                  key={location.key}
                  path='/activities/:id/edit'
                  component={ActivityForm}
                />
                <PrivateRoute
                  exact
                  key={location.key}
                  path='/activities/create'
                  component={ActivityForm}
                />
                <PrivateRoute
                  exact
                  path='/activities/:id'
                  component={ActivityDetails}
                />

                <PrivateRoute
                  exact
                  path='/profiles/:userName'
                  component={ProfilePage}
                />
                <PrivateRoute
                  exact
                  path='/server-side-error'
                  component={ServerSideError}
                />

                <PrivateRoute exact component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
});
