import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import Activity from '../../models/activity';
import NavBar from './NavBar';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    axios.get<Activity[]>(`/api/activities`).then((res) => {
      setActivities(res.data);
    });
  }, []);

  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);

  const changeActivity = (activity: Activity | undefined) => {
    setSelectedActivity(activity);
  };

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivitiesDashboard
          activities={activities}
          changeActivity={changeActivity}
          selectedActivity={selectedActivity}
        />
      </Container>
    </>
  );
}

export default App;
