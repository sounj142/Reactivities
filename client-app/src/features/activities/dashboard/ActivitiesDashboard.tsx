import { Grid } from 'semantic-ui-react';
import Activity from '../../../models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivitiesList from './ActivitiesList';

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  changeActivity: (activity: Activity | undefined) => void;
}

export default function ActivitiesDashboard({
  activities,
  selectedActivity,
  changeActivity,
}: Props) {
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivitiesList
          activities={activities}
          changeActivity={changeActivity}
        />
      </Grid.Column>

      <Grid.Column width='6'>
        {selectedActivity && (
          <ActivityDetails
            activity={selectedActivity}
            changeActivity={changeActivity}
          />
        )}
        <ActivityForm />
      </Grid.Column>
    </Grid>
  );
}
