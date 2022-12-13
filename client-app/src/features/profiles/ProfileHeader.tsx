import { observer } from 'mobx-react-lite';
import {
  Button,
  Divider,
  Grid,
  Header,
  Item,
  Reveal,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import { UserProfile } from '../../models/UserProfile';
import { useStore } from '../../stores/store';

interface Props {
  profile: UserProfile;
}
export default observer(function ProfileHeader({ profile }: Props) {
  const { userStore, followStore } = useStore();
  const { followOrUnfollow, followerLoading } = followStore;
  const profileIsCurrentUser = userStore.user?.userName === profile.userName;
  const currentUserFollowing = profile.followers.some(
    (u) => u.userName === userStore.user?.userName
  );

  function handleFollowButtonClick() {
    followOrUnfollow(profile.userName, !currentUserFollowing);
  }

  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile?.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1' content={profile?.displayName} />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>

        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic
              label={profile.followers.length === 1 ? 'Follower' : 'Followers'}
              value={profile.followers.length}
            />
            <Statistic
              label={
                profile.followings.length === 1 ? 'Following' : 'Followings'
              }
              value={profile.followings.length}
            />
          </Statistic.Group>
          <Divider />
          {!profileIsCurrentUser && (
            <Reveal animated='move'>
              <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                  fluid
                  color={currentUserFollowing ? 'teal' : 'black'}
                  content={currentUserFollowing ? 'Following' : 'Not Follow'}
                  loading={followerLoading === profile.userName}
                />
              </Reveal.Content>
              <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                  fluid
                  basic
                  loading={followerLoading === profile.userName}
                  disabled={!!followerLoading}
                  color={currentUserFollowing ? 'red' : 'green'}
                  content={currentUserFollowing ? 'Unfollow' : 'Follow'}
                  onClick={handleFollowButtonClick}
                />
              </Reveal.Content>
            </Reveal>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
});
