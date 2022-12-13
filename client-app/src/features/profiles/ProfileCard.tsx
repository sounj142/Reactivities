import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image, Reveal } from 'semantic-ui-react';
import ActivityAttendee from '../../models/ActivityAttendee';
import { UserFollowing } from '../../models/Follower';
import { useStore } from '../../stores/store';
import { truncateText } from '../../utils/common';

interface Props {
  profile: ActivityAttendee | UserFollowing;
}
export default observer(function ProfileCard({ profile }: Props) {
  const { userStore, followStore } = useStore();
  const { followOrUnfollow, followerLoading } = followStore;
  const profileIsCurrentUser = userStore.user?.userName === profile.userName;

  function handleFollowButtonClick() {
    followOrUnfollow(profile.userName, !profile.currentUserFollowing);
  }

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
        <Reveal animated='move'>
          <Reveal.Content visible style={{ width: '100%' }}>
            <Button
              fluid
              color={profile.currentUserFollowing ? 'teal' : 'black'}
              content={
                profile.currentUserFollowing ? 'Following' : 'Not Follow'
              }
              loading={followerLoading === profile.userName}
            />
          </Reveal.Content>
          <Reveal.Content hidden style={{ width: '100%' }}>
            <Button
              fluid
              basic
              loading={followerLoading === profile.userName}
              disabled={!!followerLoading}
              color={profile.currentUserFollowing ? 'red' : 'green'}
              content={profile.currentUserFollowing ? 'Unfollow' : 'Follow'}
              onClick={handleFollowButtonClick}
            />
          </Reveal.Content>
        </Reveal>
      )}
    </Card>
  );
});
