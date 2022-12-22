import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import ChangePasswordForm from '../../features/users/ChangePasswordForm';
import { useStore } from '../../stores/store';
import { history } from '../../utils/route';

export default observer(function NavBar() {
  const { userStore, modalStore } = useStore();
  const { user, logOut } = userStore;

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

        {user && (
          <>
            <Menu.Item as={NavLink} to='/activities' name='Activities' exact />

            <Menu.Item
              as={NavLink}
              to='/test-errors'
              name='Test Errors'
              exact
            />

            <Menu.Item as={NavLink} to='/activities/create' exact>
              <Button positive content='Create Activity' />
            </Menu.Item>

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
                    to={`/profiles/${user.userName}`}
                    text='My Profile'
                    icon='user'
                  />
                  <Dropdown.Item
                    onClick={() => modalStore.openModal(<ChangePasswordForm />)}
                    text='Change Password'
                    icon='lock'
                  />
                  <Dropdown.Item
                    onClick={handleLogout}
                    text='Log out'
                    icon='power'
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}
      </Container>
    </Menu>
  );
});
