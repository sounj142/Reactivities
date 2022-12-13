import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import ActivityAttendee from '../../models/ActivityAttendee';
import { UserFollowing } from '../../models/Follower';
import { useStore } from '../../stores/store';
import { truncateText } from '../../utils/common';
import FollowButton from './FollowButton';

interface Props {
  profile: ActivityAttendee | UserFollowing;
}
export default observer(function ProfileCard({ profile }: Props) {
  const { userStore } = useStore();
  const profileIsCurrentUser = userStore.user?.userName === profile.userName;

  return (
    <Card>
      <Image
        src={profile.image || '/assets/user.png'}
        as={Link}
        to={`/profiles/${profile.userName}`}
      />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>{truncateText(profile.bio, 40)}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name='user' />
        {profile.folowersCount}{' '}
        {profile.folowersCount === 1 ? 'follower' : 'followers'}
      </Card.Content>
      {!profileIsCurrentUser && (
        <FollowButton
          currentUserFollowing={profile.currentUserFollowing}
          userName={profile.userName}
        />
      )}
    </Card>
  );
});
