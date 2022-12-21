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

export default observer(function HomePage() {
  const { userStore, modalStore } = useStore();

  const facebookLogin = () => {
    userStore.facebookLogin(() => {
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
            />
            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              size='huge'
              inverted
              content='Register'
              type='button'
            />
            <Divider horizontal inverted>
              Or
            </Divider>

            <Button
              onClick={facebookLogin}
              size='huge'
              inverted
              color='facebook'
              content='Login with Facebook'
              type='button'
            />
          </>
        )}
      </Container>
    </Segment>
  );
});
