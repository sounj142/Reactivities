import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Loading from '../../app/layouts/Loading';
import { useStore } from '../../stores/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

export default observer(function ProfilePage() {
  const { profileStore } = useStore();
  const { profile, loadingProfile, getProfile } = profileStore;
  const { userName } = useParams<{ userName: string }>();

  useEffect(() => {
    getProfile(userName);
  }, [getProfile, userName]);

  if (!profile || loadingProfile)
    return <Loading content='Loading profiles...' />;
  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile} />
        <ProfileContent profile={profile} />
      </Grid.Column>
    </Grid>
  );
});
