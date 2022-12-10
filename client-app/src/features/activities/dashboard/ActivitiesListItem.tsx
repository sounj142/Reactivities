import { observer } from 'mobx-react-lite';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../stores/store';
import Activity from '../../../models/Activity';
import { formatDateTime } from '../../../utils/common';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props {
  activity: Activity;
}

export default observer(function ActivitiesListItem({ activity }: Props) {
  const { activityStore } = useStore();
  const {
    getHostInfo,
    checkCurrentUserIsHostOf,
    checkCurrentUserJoinActivity,
  } = activityStore;
  const hostUser = getHostInfo(activity);
  const isActivityHost = checkCurrentUserIsHostOf(activity);
  const attendeed = !!checkCurrentUserJoinActivity(activity);

  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            attached='top'
            color='red'
            content='Cancelled'
            style={{ textAlign: 'center' }}
          />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              as={Link}
              to={`/profiles/${hostUser?.userName}`}
              style={{ marginBottom: 3 }}
              size='tiny'
              circular
              src={hostUser?.image || '/assets/user.png'}
            />

            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>

              <Item.Description>
                Hosted by{' '}
                <Link to={`/profiles/${hostUser?.userName}`}>
                  {hostUser?.displayName}
                </Link>
              </Item.Description>

              {isActivityHost && (
                <Item.Description>
                  <Label basic color='orange'>
                    You are hosting this activity
                  </Label>
                </Item.Description>
              )}
              {!isActivityHost && attendeed && (
                <Item.Description>
                  <Label basic color='green'>
                    You are going to this activity
                  </Label>
                </Item.Description>
              )}
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

      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees} />
      </Segment>

      <Segment clearing>
        <span>{activity.description}</span>

        <Button
          floated='right'
          content='View'
          color='teal'
          as={Link}
          to={`/activities/${activity.id}`}
        />
      </Segment>
    </Segment.Group>
  );
});
