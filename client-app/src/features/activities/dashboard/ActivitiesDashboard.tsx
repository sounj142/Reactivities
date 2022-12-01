import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import Loading from '../../../app/layouts/Loading';
import { useStore } from '../../../stores/store';
import ActivitiesList from './ActivitiesList';

export default observer(function ActivitiesDashboard() {
  const { activityStore } = useStore();
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <Loading />;
  else
    return (
      <Grid>
        <Grid.Column width='10'>
          <ActivitiesList />
        </Grid.Column>
        <Grid.Column width='6'>
          <h2>Activity filter</h2>
        </Grid.Column>
      </Grid>
    );
});
