import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import { useStore } from '../../stores/store';
import Loading from './Loading';
import NavBar from './NavBar';

function App() {
  const { activityStore } = useStore();
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  return (
    <>
      {activityStore.loadingInitial && <Loading />}
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivitiesDashboard />
      </Container>
    </>
  );
}

export default observer(App);
