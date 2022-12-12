import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react';
import Activity from '../../../models/Activity';
import { useStore } from '../../../stores/store';
import { formatDate, getImageUrl } from '../../../utils/common';

const activityImageStyle = {
  filter: 'brightness(30%)',
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};

interface Props {
  activity: Activity;
}
export default observer(function ActivityDetailedHeader({ activity }: Props) {
  const {
    activityStore: {
      getHostInfo,
      checkCurrentUserIsHostOf,
      checkCurrentUserJoinActivity,
      acceptAttendance,
      rejectAttendance,
      cancelActivity,
      reactivateActivity,
      formSubmitting,
    },
  } = useStore();
  const hostUser = getHostInfo(activity);
  const isActivityHost = checkCurrentUserIsHostOf(activity);
  const attendeed = !!checkCurrentUserJoinActivity(activity);

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        {activity.isCancelled && (
          <Label
            ribbon
            color='red'
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
            content='Cancelled'
          />
        )}
        <Image
          src={getImageUrl(activity.category)}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{formatDate(activity.date)}</p>
                <p>
                  Hosted by{' '}
                  <strong>
                    <Link to={`/profiles/${hostUser?.userName}`}>
                      {hostUser?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {isActivityHost ? (
          <>
            {activity.isCancelled ? (
              <Button
                color='green'
                floated='left'
                basic
                loading={formSubmitting}
                disabled={formSubmitting}
                onClick={() => reactivateActivity(activity)}
              >
                Re-Activate Activity
              </Button>
            ) : (
              <Button
                color='red'
                floated='left'
                basic
                loading={formSubmitting}
                disabled={formSubmitting}
                onClick={() => cancelActivity(activity)}
              >
                Cancel Activity
              </Button>
            )}
            <Button
              color='orange'
              floated='right'
              as={Link}
              to={`/activities/${activity.id}/edit`}
              disabled={activity.isCancelled}
            >
              Manage Event
            </Button>
          </>
        ) : attendeed ? (
          <Button
            loading={formSubmitting}
            disabled={formSubmitting}
            onClick={() => rejectAttendance(activity)}
          >
            Cancel Attendance
          </Button>
        ) : (
          <Button
            color='teal'
            loading={formSubmitting}
            disabled={formSubmitting || activity.isCancelled}
            onClick={() => acceptAttendance(activity)}
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
});
