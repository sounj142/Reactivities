import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import ActivityAttendee from '../../models/ActivityAttendee';
import { truncateText } from '../../utils/common';

interface Props {
  profile: ActivityAttendee;
}

export default observer(function ProfileCard({ profile }: Props) {
  return (
    <Card as={Link} to={`/profiles/${profile.userName}`}>
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>{truncateText(profile.bio, 40)}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name='user' />
        20 followers
      </Card.Content>
    </Card>
  );
});
