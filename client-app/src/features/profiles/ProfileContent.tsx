import { observer } from 'mobx-react-lite';
import { Tab } from 'semantic-ui-react';
import { UserProfile } from '../../models/UserProfile';
import ProfileAbout from './ProfileAbout';
import ProfileEvents from './ProfileEvents';
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
      render: () => <ProfileEvents profile={profile} />,
    },
    {
      menuItem: 'Followers',
      render: () => <ProfileFollowings profile={profile} isFollowing={false} />,
    },
    {
      menuItem: 'Following',
      render: () => <ProfileFollowings profile={profile} isFollowing={true} />,
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
