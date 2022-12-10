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
                <Route
                  exact
                  path='/activities'
                  component={ActivitiesDashboard}
                />

                <Route
                  exact
                  key={location.key}
                  path='/activities/:id/edit'
                  component={ActivityForm}
                />
                <Route
                  exact
                  key={location.key}
                  path='/activities/create'
                  component={ActivityForm}
                />
                <Route
                  exact
                  path='/activities/:id'
                  component={ActivityDetails}
                />

                <Route
                  exact
                  path='/profiles/:userName'
                  component={ProfilePage}
                />
                <Route
                  exact
                  path='/server-side-error'
                  component={ServerSideError}
                />

                <Route exact component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
});
