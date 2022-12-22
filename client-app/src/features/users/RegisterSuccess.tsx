import { observer } from 'mobx-react-lite';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import { useQuery } from '../../utils/hooks';

export default observer(function RegisterSuccess() {
  const { userStore } = useStore();
  const email = useQuery().get('email');

  async function handleConfirmEmailResend() {
    await userStore.resendConfirmationEmail(email!);
    toast.success(
      'A confirmation email has been sent. Please check your email.'
    );
  }

  if (!email) return <Redirect to='/' />;
  return (
    <Segment placeholder textAlign='center'>
      <Header icon color='green'>
        <Icon name='check' />
        Successfully registered!
      </Header>
      <p>
        Please check your email (include junk email) for the verification email
      </p>
      <p>Didn't receive email? Click the bellow button to resend.</p>

      <Button
        primary
        onClick={handleConfirmEmailResend}
        content='Resend Email'
        size='huge'
        type='button'
      />
    </Segment>
  );
});
