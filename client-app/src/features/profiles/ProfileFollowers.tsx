import { observer } from 'mobx-react-lite';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { UserProfile } from '../../models/UserProfile';
import ProfileCard from './ProfileCard';

interface Props {
  profile: UserProfile;
}
export default observer(function ProfileFollowers({ profile }: Props) {
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={`People following ${profile.displayName}`}
          />
        </Grid.Column>

        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {profile.followers.map((follower) => (
              <ProfileCard key={follower.userName} profile={follower} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
