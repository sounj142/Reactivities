import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import { history } from '../../utils/route';

export default observer(function NavBar() {
  const {
    userStore: { user, logOut },
  } = useStore();

  const handleLogout = () => {
    logOut();
    history.push('/');
  };

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} to='/' exact>
          <img
            src='/assets/logo.png'
            alt='logo'
            style={{ marginRight: '10px' }}
          />
          Reactivities
        </Menu.Item>

        <Menu.Item as={NavLink} to='/activities' name='Activities' exact />

        <Menu.Item as={NavLink} to='/test-errors' name='Test Errors' exact />

        <Menu.Item as={NavLink} to='/activities/create' exact>
          <Button positive content='Create Activity' />
        </Menu.Item>

        {user && (
          <Menu.Item position='right'>
            <Image
              src={user.image || '/assets/user.png'}
              avatar
              spaced='right'
            />
            <Dropdown pointing='top left' text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.userName}`}
                  text='My Profile'
                  icon='user'
                />
                <Dropdown.Item
                  onClick={handleLogout}
                  text='Log out'
                  icon='power'
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
});
