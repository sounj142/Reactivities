import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    axios.get(`/api/activities`).then((res) => {
      setActivities(res.data);
    });
  }, []);

  return (
    <div>
      <Header as='h2' icon='users' content='Activities' />
      <List>
        {activities.map((activity: any) => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
