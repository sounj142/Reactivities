import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import Activity from '../../models/Activity';
import NavBar from './NavBar';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);

  const changeActivity = (activity?: Activity) => setSelectedActivity(activity);

  const [editMode, setEditMode] = useState(false);

  const handleFormOpen = (activity?: Activity) => {
    setEditMode(true);
    changeActivity(activity);
  };

  const handleFormClose = () => {
    setEditMode(false);
  };

  function handleCreateOrEditActivity(activity: Activity) {
    const newActivities = [...activities];
    const newActivity = { ...activity };
    const index = newActivities.findIndex((x) => x.id === activity.id);
    if (index >= 0) newActivities[index] = newActivity;
    else newActivities.push(newActivity);
    setActivities(newActivities);

    setSelectedActivity(newActivity);
  }

  function handleDeleteActivity(activity: Activity) {
    const newActivities = activities.filter((x) => x.id !== activity.id);
    setActivities(newActivities);

    if (activity.id === selectedActivity?.id) {
      setSelectedActivity(undefined);
    }
  }

  useEffect(() => {
    axios.get<Activity[]>(`/api/activities`).then((res) => {
      setActivities(res.data);
    });
  }, []);

  return (
    <>
      <NavBar handleFormOpen={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivitiesDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          changeActivity={changeActivity}
          editMode={editMode}
          handleFormOpen={handleFormOpen}
          handleFormClose={handleFormClose}
          handleCreateOrEditActivity={handleCreateOrEditActivity}
          handleDeleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
