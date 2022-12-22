import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { VerifyEmailDto } from '../../models/User';
import { useStore } from '../../stores/store';
import { useQuery } from '../../utils/hooks';
import LoginForm from './LoginForm';

const Status = {
  Verifying: 'Verifying',
  Failed: 'Failed',
  Success: 'Success',
};

export default observer(function ConfirmEmail() {
  const { userStore, modalStore } = useStore();
  const queries = useQuery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const model: VerifyEmailDto = {
    email: queries.get('email')!,
    token: queries.get('token')!,
  };

  const [status, setStatus] = useState(Status.Verifying);

  async function handleConfirmEmailResend() {
    await userStore.resendConfirmationEmail(model.email);
    toast.success(
      'A confirmation email has been sent. Please check your email.'
    );
  }

  useEffect(() => {
    if (model.email && model.token) {
      userStore
        .verifyEmail(model)
        .then(() => {
          setStatus(Status.Success);
        })
        .catch(() => {
          setStatus(Status.Failed);
        });
    }
  }, [model, userStore]);

  function getBody() {
    switch (status) {
      case Status.Verifying:
        return <p>Verifying...</p>;
      case Status.Failed:
        return (
          <div>
            <p>
              Verification failed. You can try resending the verify link to your
              email
            </p>

            <Button
              primary
              onClick={handleConfirmEmailResend}
              content='Resend Email'
              size='huge'
              type='button'
            />
          </div>
        );
      case Status.Success:
        return (
          <div>
            <p>Your email has been verified. You can now login.</p>
            <Button
              primary
              onClick={() => modalStore.openModal(<LoginForm />)}
              content='Login'
              size='huge'
              type='button'
            />
          </div>
        );
    }
  }

  if (!model.email || !model.token) return <Redirect to='/' />;

  return (
    <Segment placeholder textAlign='center'>
      <Header icon>
        <Icon name='envelope' />
        Email verification
      </Header>

      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
});
