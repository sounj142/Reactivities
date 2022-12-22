import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import ValidationErrors from '../errors/ValidationErrors';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/form/MyTextInput';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

interface Props {
  email?: string;
}
export default observer(function ResendConfirmEmailForm({ email }: Props) {
  const { userStore, modalStore } = useStore();
  const [serverResponse, setServerResponse] = useState<any>(undefined);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required.')
      .email('Email should be a valid email address.'),
  });

  const formSubmitHandle = async (model: { email: string }) => {
    setServerResponse(undefined);
    try {
      await userStore.resendConfirmationEmail(model.email);
      modalStore.closeModal();
      toast.success(
        'A confirmation email has been sent. Please check your email.'
      );
    } catch (err: any) {
      setServerResponse(err.response?.data);
    }
  };

  return (
    <Formik
      initialValues={{
        email: email || '',
      }}
      validationSchema={validationSchema}
      onSubmit={formSubmitHandle}
    >
      {({ isValid, isSubmitting, dirty }) => (
        <Form className='ui form'>
          <Header
            as='h2'
            content='Resend verification email'
            color='teal'
            textAlign='center'
          />
          <MyTextInput placeholder='Email' name='email' />

          {serverResponse && (
            <ValidationErrors serverResponse={serverResponse} />
          )}

          <Button
            positive
            type='submit'
            content='Resend Email'
            fluid
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
});
