import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { Route, useLocation } from 'react-router-dom';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import NavBar from './NavBar';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

export default observer(function App() {
  const location = useLocation();
  return (
    <>
      <Route exact path='/' component={HomePage} />
      <Route
        path='/(.+)'
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Route exact path='/activities' component={ActivitiesDashboard} />
              <Route
                exact
                path='/activities/details/:id'
                component={ActivityDetails}
              />
              <Route
                exact
                path={['/activities/create/new', '/activities/edit/:id']}
                component={ActivityForm}
                key={location.key}
              />
            </Container>
          </>
        )}
      />
    </>
  );
});
