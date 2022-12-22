import {
  Button,
  Container,
  Divider,
  Header,
  Image,
  Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';
import { history } from '../../utils/route';
import { toast } from 'react-toastify';

let showedLoginPopup = false;

interface Props {
  isEmailConfirmed?: boolean;
}
export default observer(function HomePage({ isEmailConfirmed }: Props) {
  const { userStore, modalStore } = useStore();
  const { facebookLogin, facebookLoading } = userStore;

  if (isEmailConfirmed && !showedLoginPopup) {
    window.setTimeout(() => {
      toast.success('Your account has been activated. Please login...');
      modalStore.openModal(<LoginForm />);
    });
    showedLoginPopup = true;
  }

  const facebookLoginHandle = () => {
    facebookLogin(() => {
      history.push('/activities');
    });
  };

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>

        {userStore.isLoggedIn ? (
          <>
            <Header as='h2' inverted content='Welcome to Reactivities' />
            <Button
              as={Link}
              to='/activities'
              size='huge'
              inverted
              content='Go to Activities!'
              type='button'
            />
          </>
        ) : (
          <>
            <Button
              onClick={() => modalStore.openModal(<LoginForm />)}
              size='huge'
              inverted
              content='Login'
              type='button'
              disabled={facebookLoading}
            />
            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              size='huge'
              inverted
              content='Register'
              type='button'
              disabled={facebookLoading}
            />
            <Divider horizontal inverted>
              Or
            </Divider>

            <Button
              onClick={facebookLoginHandle}
              size='huge'
              inverted
              color='facebook'
              content='Login with Facebook'
              type='button'
              loading={facebookLoading}
              disabled={facebookLoading}
            />
          </>
        )}
      </Container>
    </Segment>
  );
});
