import { Header, Menu } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivitiesFilters() {
  const { activityStore } = useStore();
  const { setParamIsHost, setParamIsGoing, setParamAll, setStartDate, params } =
    activityStore;

  return (
    <>
      <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
        <Header icon='filter' attached color='teal' content='Filters' />
        <Menu.Item
          content='All Activities'
          onClick={setParamAll}
          active={!params.isGoing && !params.isHost}
        />
        <Menu.Item
          content="I'm going"
          onClick={setParamIsGoing}
          active={params.isGoing}
        />
        <Menu.Item
          content="I'm hosting"
          onClick={setParamIsHost}
          active={params.isHost}
        />
      </Menu>
      <Header />
      <Calendar value={params.startDate} onChange={setStartDate} />
    </>
  );
});
