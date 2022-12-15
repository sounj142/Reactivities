import { observer } from 'mobx-react-lite';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { UserProfile } from '../../models/UserProfile';
import ProfileCard from './ProfileCard';

interface Props {
  profile: UserProfile;
  isFollowing: boolean;
}
export default observer(function ProfileFollowings({
  profile,
  isFollowing,
}: Props) {
  const headerText = isFollowing
    ? `People ${profile.displayName} is following`
    : `People following ${profile.displayName}`;
  const followings = isFollowing ? profile.followings : profile.followers;

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='user' content={headerText} />
        </Grid.Column>

        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings.map((follower) => (
              <ProfileCard key={follower.userName} profile={follower} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
