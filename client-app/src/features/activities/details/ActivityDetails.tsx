import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import Loading from '../../../app/layouts/Loading';
import { useStore } from '../../../stores/store';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    activityStore.loadActivity(id);
  }, [activityStore, id]);

  const activity = activityStore.selectedActivity;

  if (!activity) return <Loading />;
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>

      <Grid.Column width='6'>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
});
