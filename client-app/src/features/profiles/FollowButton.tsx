import { observer } from 'mobx-react-lite';
import { Button, Reveal } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

interface Props {
  currentUserFollowing: boolean;
  userName: string;
}
export default observer(function FollowButton({
  currentUserFollowing,
  userName,
}: Props) {
  const { followStore } = useStore();
  const { followOrUnfollow, followerLoading } = followStore;

  function handleFollowButtonClick() {
    followOrUnfollow(userName, !currentUserFollowing);
  }

  return (
    <Reveal animated='move'>
      <Reveal.Content visible style={{ width: '100%' }}>
        <Button
          fluid
          color={currentUserFollowing ? 'teal' : 'black'}
          content={currentUserFollowing ? 'Following' : 'Not Following'}
          loading={followerLoading === userName}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: '100%' }}>
        <Button
          fluid
          basic
          loading={followerLoading === userName}
          disabled={!!followerLoading}
          color={currentUserFollowing ? 'red' : 'green'}
          content={currentUserFollowing ? 'Unfollow' : 'Follow'}
          onClick={handleFollowButtonClick}
        />
      </Reveal.Content>
    </Reveal>
  );
});
