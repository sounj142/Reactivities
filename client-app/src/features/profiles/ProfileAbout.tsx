import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import * as Yup from 'yup';
import MyTextArea from '../../app/form/MyTextArea';
import MyTextInput from '../../app/form/MyTextInput';
import { UserAbout, UserProfile } from '../../models/UserProfile';
import { useStore } from '../../stores/store';
import ValidationErrors from '../errors/ValidationErrors';

interface Props {
  profile: UserProfile;
}
export default observer(function ProfileAbout({ profile }: Props) {
  const { profileStore } = useStore();
  const { checkProfileIsCurrentUser, updateProfileAbout } = profileStore;
  const profileIsCurrentUser = checkProfileIsCurrentUser(profile);
  const [editMode, setEditMode] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  const initialModel: UserAbout = {
    displayName: profile.displayName,
    bio: profile.bio,
  };
  const [serverResponse, setServerResponse] = useState<any>(undefined);

  const validationSchema = Yup.object({
    displayName: Yup.string()
      .required('Display name is required.')
      .max(200, 'Display name must not exceed 200 characters.'),
    bio: Yup.string().max(10000, 'Bio must not exceed 10000 characters.'),
  });

  const formSubmitHandle = async (registerModel: UserAbout) => {
    setServerResponse(undefined);
    setFormIsSubmitting(true);
    try {
      await updateProfileAbout(registerModel);
      setEditMode(false);
    } catch (err: any) {
      setServerResponse(err.response?.data);
    } finally {
      setFormIsSubmitting(false);
    }
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={`About ${profile.displayName}`}
          />
          {profileIsCurrentUser && (
            <Button
              floated='right'
              basic
              content={editMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditMode(!editMode)}
              disabled={formIsSubmitting}
            />
          )}
        </Grid.Column>

        <Grid.Column width={16}>
          {editMode ? (
            <Formik
              initialValues={initialModel}
              validationSchema={validationSchema}
              onSubmit={formSubmitHandle}
            >
              {({ isValid, dirty }) => {
                return (
                  <Form className='ui form'>
                    <MyTextInput
                      placeholder='Display name'
                      name='displayName'
                    />
                    <MyTextArea placeholder='Bio' name='bio' rows={4} />

                    {serverResponse && (
                      <ValidationErrors serverResponse={serverResponse} />
                    )}
                    <Button
                      positive
                      type='submit'
                      content='Update profile'
                      floated='right'
                      loading={formIsSubmitting}
                      disabled={!isValid || !dirty || formIsSubmitting}
                    />
                  </Form>
                );
              }}
            </Formik>
          ) : (
            <p className='display-linebreak'>{profile.bio}</p>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
