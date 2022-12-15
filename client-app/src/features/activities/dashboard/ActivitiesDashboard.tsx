import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import InfiniteScroller from 'react-infinite-scroller';
import { useStore } from '../../../stores/store';
import ActivitiesFilters from './ActivitiesFilters';
import ActivitiesList from './ActivitiesList';
import ActivityListItemPlaceholder from './ActivitiesListItemPlaceholder';

export default observer(function ActivitiesDashboard() {
  const { activityStore } = useStore();
  const {
    loadActivitiesForFirstTime,
    loadingInitial,
    loadActivitiesForNextPage,
    loadingNextPage,
    hasNextPage,
  } = activityStore;

  useEffect(() => {
    loadActivitiesForFirstTime();
  }, [loadActivitiesForFirstTime]);

  return (
    <Grid>
      <Grid.Column width='10'>
        {loadingInitial ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroller
            pageStart={1}
            loadMore={loadActivitiesForNextPage}
            hasMore={!loadingNextPage && hasNextPage}
            initialLoad={false}
          >
            <ActivitiesList />
          </InfiniteScroller>
        )}
      </Grid.Column>

      <Grid.Column width='6'>
        <ActivitiesFilters />
      </Grid.Column>

      <Grid.Column width='10'>
        <Loader active={loadingNextPage} />
      </Grid.Column>
    </Grid>
  );
});
