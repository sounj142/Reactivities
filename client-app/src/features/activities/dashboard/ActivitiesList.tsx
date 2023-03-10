import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import ActivitiesListItem from './ActivitiesListItem';

export default observer(function ActivitiesList() {
  const { activityStore } = useStore();
  const { activitiesGroupByDate } = activityStore;

  if (!activitiesGroupByDate.length)
    return (
      <Fragment>
        <Header sub>&nbsp;</Header>
        <Segment>No Activities</Segment>
      </Fragment>
    );
  return (
    <>
      {activitiesGroupByDate.map((item) => (
        <Fragment key={item.date}>
          <Header sub color='teal'>
            {item.date}
          </Header>

          {item.activities.map((activity) => (
            <ActivitiesListItem key={activity.id} activity={activity} />
          ))}
        </Fragment>
      ))}
    </>
  );
});
