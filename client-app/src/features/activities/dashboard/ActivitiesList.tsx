import { useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import activityApis from '../../../api/activity-api';
import Activity from '../../../models/Activity';

interface Props {
  activities: Activity[];
  changeActivity: (activity?: Activity) => void;
  handleFormClose: () => void;
  handleDeleteActivity: (activity: Activity) => void;
}

export default function ActivitiesList({
  activities,
  changeActivity,
  handleFormClose,
  handleDeleteActivity,
}: Props) {
  const [deletingId, setDeletingId] = useState('');

  function viewButtonHandle(activity: Activity) {
    handleFormClose();
    changeActivity(activity);
  }

  async function deleteActivity(activity: Activity) {
    setDeletingId(activity.id);
    try {
      await activityApis.delete(activity.id);
      handleDeleteActivity(activity);
    } finally {
      setDeletingId('');
    }
  }

  return (
    <Segment>
      <Item.Group divided>
        {activities.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as='a'>{activity.title}</Item.Header>
              <Item.Meta>{activity.date.toString()}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  floated='right'
                  content='View'
                  color='blue'
                  onClick={() => viewButtonHandle(activity)}
                  loading={deletingId === activity.id}
                />
                <Button
                  floated='right'
                  content='Delete'
                  color='red'
                  onClick={() => deleteActivity(activity)}
                  loading={deletingId === activity.id}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}
