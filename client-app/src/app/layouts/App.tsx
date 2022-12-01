import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import NavBar from './NavBar';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

export default observer(function App() {
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
                path='/activities/:id/edit'
                component={ActivityForm}
              />

              <Route exact path='/activities/create' component={ActivityForm} />
              <Route
                exact
                path='/activities/:id'
                render={(props) =>
                  props.match.params.id === 'create' ? undefined : (
                    <ActivityDetails />
                  )
                }
              />
            </Container>
          </>
        )}
      />
    </>
  );
});
