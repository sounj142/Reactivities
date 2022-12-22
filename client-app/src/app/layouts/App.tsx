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
import { useStore } from '../../stores/store';
import Loading from './Loading';
import RegisterSuccess from '../../features/users/RegisterSuccess';
import ConfirmEmail from '../../features/users/ConfirmEmail';

export default observer(function App() {
  const { userStore } = useStore();
  const location = useLocation();

  if (userStore.userLoading) return <Loading content='Loading app...' />;
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />

      <Switch>
        <Route exact path='/' component={HomePage} />

        <Route
          exact
          path='/account/email-confirmed'
          render={() => <HomePage isEmailConfirmed={true} />}
        />

        <Route
          exact
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

                  <Route
                    exact
                    path='/account/register-success'
                    component={RegisterSuccess}
                  />

                  <Route
                    exact
                    path='/account/verify-email'
                    component={ConfirmEmail}
                  />

                  <PrivateRoute exact component={NotFound} />
                </Switch>
              </Container>
            </>
          )}
        />
      </Switch>
    </>
  );
});
