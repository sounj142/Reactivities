import { observer } from 'mobx-react-lite';
import {
  Divider,
  Grid,
  Header,
  Item,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import { UserProfile } from '../../models/UserProfile';
import { useStore } from '../../stores/store';
import FollowButton from './FollowButton';

interface Props {
  profile: UserProfile;
}
export default observer(function ProfileHeader({ profile }: Props) {
  const { userStore } = useStore();
  const profileIsCurrentUser = userStore.user?.userName === profile.userName;
  const currentUserFollowing = profile.followers.some(
    (u) => u.userName === userStore.user?.userName
  );

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
            <FollowButton
              currentUserFollowing={currentUserFollowing}
              userName={profile.userName}
            />
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
});
