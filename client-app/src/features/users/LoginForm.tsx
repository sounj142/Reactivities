import { Form, Formik } from 'formik';
import { LoginDto } from '../../models/User';
import * as Yup from 'yup';
import { MouseEvent, useState } from 'react';
import ValidationErrors from '../errors/ValidationErrors';
import { Button, Header, Message } from 'semantic-ui-react';
import MyTextInput from '../../app/form/MyTextInput';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import { history } from '../../utils/route';
import ResendConfirmEmailForm from './ResendConfirmEmailForm';

export default observer(function LoginForm() {
  const { userStore, modalStore } = useStore();
  const initialModel: LoginDto = {
    email: '',
    password: '',
  };
  const [serverResponse, setServerResponse] = useState<any>(undefined);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required.')
      .email('Email should be a valid email address.'),
    password: Yup.string().required('Password is required.'),
  });

  const formSubmitHandle = async (loginModel: LoginDto) => {
    setServerResponse(undefined);
    setEmailNotConfirmed(false);
    try {
      await userStore.login(loginModel);
      modalStore.closeModal();
      history.push('/activities');
    } catch (err: any) {
      if (err.response?.data?.errors?._EMAIL_NOT_CONFIRMED)
        setEmailNotConfirmed(true);
      else setServerResponse(err.response?.data);
    }
  };

  function resendConfirmEmailHandle(e: MouseEvent, email: string) {
    e.preventDefault();
    modalStore.closeModal();
    modalStore.openModal(<ResendConfirmEmailForm email={email} />);
  }

  return (
    <Formik
      initialValues={initialModel}
      validationSchema={validationSchema}
      onSubmit={formSubmitHandle}
    >
      {({ isValid, isSubmitting, dirty, values }) => (
        <Form className='ui form'>
          <Header
            as='h2'
            content='Login to Reactivities'
            color='teal'
            textAlign='center'
          />
          <MyTextInput placeholder='Email' name='email' />
          <MyTextInput placeholder='Password' name='password' type='password' />

          {emailNotConfirmed && (
            <Message error className='error-messages'>
              Your email has to be confirmed before you can login. You can
              resend the email with verification link by clicking
              <a
                href='#/'
                onClick={(e) => resendConfirmEmailHandle(e, values.email)}
              >
                {' '}
                here
              </a>
            </Message>
          )}

          {serverResponse && (
            <ValidationErrors serverResponse={serverResponse} />
          )}

          <Button
            positive
            type='submit'
            content='Login'
            fluid
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
});
