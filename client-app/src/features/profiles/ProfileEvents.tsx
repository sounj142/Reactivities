import { observer } from 'mobx-react-lite';
import { Grid, Header, Tab } from 'semantic-ui-react';
import { ActivityFilterPredicateType } from '../../models/ActivityMinimumInfo';
import { UserProfile } from '../../models/UserProfile';
import ProfileEventsList from './ProfileEventsList';

interface Props {
  profile: UserProfile;
}
export default observer(function ProfileEvents({ profile }: Props) {
  const panes = [
    {
      menuItem: 'Future Events',
      render: () => (
        <ProfileEventsList
          userName={profile.userName}
          predicate={ActivityFilterPredicateType.Future}
        />
      ),
    },
    {
      menuItem: 'Past Events',
      render: () => (
        <ProfileEventsList
          userName={profile.userName}
          predicate={ActivityFilterPredicateType.Past}
        />
      ),
    },
    {
      menuItem: 'Hosting',
      render: () => (
        <ProfileEventsList
          userName={profile.userName}
          predicate={ActivityFilterPredicateType.Hosting}
        />
      ),
    },
  ];

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content='Activities' />
        </Grid.Column>

        <Grid.Column width={16}>
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
