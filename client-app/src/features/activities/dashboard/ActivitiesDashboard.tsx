import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivitiesList from './ActivitiesList';

export default observer(function ActivitiesDashboard() {
  const { activityStore } = useStore();
  const { editMode, selectedActivity } = activityStore;
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivitiesList />
      </Grid.Column>

      <Grid.Column width='6'>
        {!editMode && selectedActivity && <ActivityDetails />}
        {editMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
});
