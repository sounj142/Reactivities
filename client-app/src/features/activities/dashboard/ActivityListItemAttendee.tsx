import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';
import ActivityAttendee from '../../../models/ActivityAttendee';
import ProfileCard from '../../profiles/ProfileCard';

const styles = {
  borderColor: 'orange',
  borderWidth: 3,
};

interface Props {
  attendees: ActivityAttendee[];
}
export default observer(function ActivityListItemAttendee({
  attendees,
}: Props) {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.userName}
          trigger={
            <List.Item as={Link} to={`/profiles/${attendee.userName}`}>
              <Image
                size='mini'
                circular
                bordered
                src={attendee.image || '/assets/user.png'}
                style={attendee.currentUserFollowing ? styles : null}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});
