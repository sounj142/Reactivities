import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import ImageUploadWidget from '../../app/image-upload/ImageUploadWidget';
import { Photo } from '../../models/Photo';
import { UserProfile } from '../../models/UserProfile';
import { useStore } from '../../stores/store';

interface Props {
  profile: UserProfile;
}
export default observer(function ProfilePhotos({ profile }: Props) {
  const { profileStore } = useStore();
  const {
    checkProfileIsCurrentUser,
    uploadPhoto,
    processingPhoto,
    setMainPhoto,
    deletePhoto,
  } = profileStore;
  const profileIsCurrentUser = checkProfileIsCurrentUser(profile);
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo>();
  const [settingMainPhoto, setSettingMainPhoto] = useState<Photo>();

  async function handlePhotoUpload(file: Blob) {
    await uploadPhoto(file);
    setAddPhotoMode(false);
  }

  async function setMainPhotoHandle(photo: Photo) {
    setSettingMainPhoto(photo);
    try {
      await setMainPhoto(photo.id);
    } finally {
      setSettingMainPhoto(undefined);
    }
  }

  async function deletePhotoHandle(photo: Photo) {
    setDeletingPhoto(photo);
    try {
      await deletePhoto(photo.id);
    } finally {
      setDeletingPhoto(undefined);
    }
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='image' content='Photos' />
          {profileIsCurrentUser && (
            <Button
              floated='right'
              basic
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>

        <Grid.Column width={16}>
          {addPhotoMode ? (
            <ImageUploadWidget
              loading={processingPhoto}
              handlePhotoUpload={handlePhotoUpload}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {profileIsCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color='green'
                        content='Main'
                        disabled={photo.isMain || !!deletingPhoto}
                        loading={settingMainPhoto?.id === photo.id}
                        onClick={() => setMainPhotoHandle(photo)}
                      />

                      <Button
                        basic
                        color='red'
                        icon='trash'
                        disabled={photo.isMain || !!deletingPhoto}
                        loading={deletingPhoto?.id === photo.id}
                        onClick={() => deletePhotoHandle(photo)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
