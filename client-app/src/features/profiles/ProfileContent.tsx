import { observer } from 'mobx-react-lite';
import { Tab } from 'semantic-ui-react';
import { UserProfile } from '../../models/UserProfile';
import ProfileAbout from './ProfileAbout';
import ProfileFollowers from './ProfileFollowers';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';

interface Props {
  profile: UserProfile;
}
export default observer(function ProfileContent({ profile }: Props) {
  const panes = [
    {
      menuItem: 'About',
      render: () => <ProfileAbout profile={profile} />,
    },
    {
      menuItem: 'Photos',
      render: () => <ProfilePhotos profile={profile} />,
    },
    {
      menuItem: 'Events',
      render: () => <Tab.Pane>Events Content</Tab.Pane>,
    },
    {
      menuItem: 'Followers',
      render: () => <ProfileFollowers profile={profile} />,
    },
    {
      menuItem: 'Following',
      render: () => <ProfileFollowings profile={profile} />,
    },
  ];
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
    />
  );
});
