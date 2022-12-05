import { observer } from 'mobx-react-lite';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../stores/store';
import Activity from '../../../models/Activity';
import { formatDateTime } from '../../../utils/common';

interface Props {
  activity: Activity;
}

export default observer(function ActivitiesListItem({ activity }: Props) {
  const { activityStore } = useStore();
  const { deletingId, deleteActivity } = activityStore;

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by Hoang</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>

      <Segment>
        <span>
          <Icon name='clock' /> {formatDateTime(activity.date)}
          <Icon name='marker' /> {activity.venue}
        </span>
      </Segment>

      <Segment secondary>Attendees go here</Segment>

      <Segment clearing>
        <span>{activity.description}</span>

        <Button
          floated='right'
          content='View'
          color='teal'
          as={Link}
          to={`/activities/${activity.id}`}
          disabled={deletingId === activity.id}
        />

        <Button
          floated='right'
          content='Delete'
          color='red'
          onClick={() => deleteActivity(activity)}
          loading={deletingId === activity.id}
        />
      </Segment>
    </Segment.Group>
  );
});
