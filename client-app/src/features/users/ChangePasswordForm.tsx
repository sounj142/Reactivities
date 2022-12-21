import { Form, Formik } from 'formik';
import { ChangePasswordDto } from '../../models/User';
import * as Yup from 'yup';
import { useState } from 'react';
import ValidationErrors from '../errors/ValidationErrors';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/form/MyTextInput';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ChangePasswordForm() {
  const { userStore, modalStore } = useStore();
  const isEmptyCredential = userStore.user?.isEmptyCredential;
  const initialModel: ChangePasswordDto = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  const [serverResponse, setServerResponse] = useState<any>(undefined);

  const validationConfig: any = {
    newPassword: Yup.string()
      .required('New password is required.')
      .min(6, 'New password must have at least 6 characters.')
      .max(100, 'New password must not exceed 100 characters.')
      .test(
        'new-password-different',
        'New password must be different from current password.',
        function (value) {
          return this.parent.currentPassword !== value;
        }
      ),
    confirmNewPassword: Yup.string().test(
      'passwords-match',
      'Confirm password must match new password.',
      function (value) {
        return this.parent.newPassword === value;
      }
    ),
  };
  if (!isEmptyCredential)
    validationConfig.currentPassword = Yup.string().required(
      'Current password is required.'
    );
  const validationSchema = Yup.object(validationConfig);

  const formSubmitHandle = async (model: ChangePasswordDto) => {
    setServerResponse(undefined);
    try {
      await userStore.changePassword(model);
      modalStore.closeModal();
    } catch (err: any) {
      setServerResponse(err.response?.data);
    }
  };

  return (
    <Formik
      initialValues={initialModel}
      validationSchema={validationSchema}
      onSubmit={formSubmitHandle}
    >
      {({ isValid, isSubmitting, dirty }) => (
        <Form className='ui form'>
          <Header
            as='h2'
            content='Change Password'
            color='teal'
            textAlign='center'
          />
          {!isEmptyCredential && (
            <MyTextInput
              placeholder='Current password'
              name='currentPassword'
              type='password'
            />
          )}

          <MyTextInput
            placeholder='New password'
            name='newPassword'
            type='password'
          />
          <MyTextInput
            placeholder='Confirm new password'
            name='confirmNewPassword'
            type='password'
          />

          {serverResponse && (
            <ValidationErrors serverResponse={serverResponse} />
          )}

          <Button
            positive
            type='submit'
            content='Change password'
            fluid
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
});
