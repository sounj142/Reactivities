import { Button, Container, Menu } from 'semantic-ui-react';
import Activity from '../../models/Activity';

interface Props {
  handleFormOpen: (activity?: Activity) => void;
}

export default function NavBar({ handleFormOpen }: Props) {
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img
            src='/assets/logo.png'
            alt='logo'
            style={{ marginRight: '10px' }}
          />
          Reactivities
        </Menu.Item>

        <Menu.Item name='Activities' />

        <Menu.Item>
          <Button
            positive
            content='Create Activity'
            onClick={() => handleFormOpen(undefined)}
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
