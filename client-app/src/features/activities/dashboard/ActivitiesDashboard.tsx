import { Grid } from 'semantic-ui-react';
import Activity from '../../../models/Activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivitiesList from './ActivitiesList';

interface Props {
  activities: Activity[];
  selectedActivity?: Activity;
  changeActivity: (activity?: Activity) => void;
  editMode: boolean;
  handleFormOpen: (activity?: Activity) => void;
  handleFormClose: () => void;
  handleCreateOrEditActivity: (activity: Activity) => void;
  handleDeleteActivity: (activity: Activity) => void;
}

export default function ActivitiesDashboard({
  activities,
  selectedActivity,
  changeActivity,
  editMode,
  handleFormOpen,
  handleFormClose,
  handleCreateOrEditActivity,
  handleDeleteActivity,
}: Props) {
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivitiesList
          activities={activities}
          changeActivity={changeActivity}
          handleFormClose={handleFormClose}
          handleDeleteActivity={handleDeleteActivity}
        />
      </Grid.Column>

      <Grid.Column width='6'>
        {!editMode && selectedActivity && (
          <ActivityDetails
            activity={selectedActivity}
            changeActivity={changeActivity}
            handleFormOpen={handleFormOpen}
          />
        )}
        {editMode && (
          <ActivityForm
            selectedActivity={selectedActivity}
            handleFormClose={handleFormClose}
            handleCreateOrEditActivity={handleCreateOrEditActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
