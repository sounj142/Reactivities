import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

export default observer(function NavBar() {
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
      </Container>
    </Menu>
  );
});
