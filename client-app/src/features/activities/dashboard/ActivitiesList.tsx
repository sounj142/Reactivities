import axios from 'axios';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
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
  function viewButtonHandle(activity: Activity) {
    handleFormClose();
    changeActivity(activity);
  }

  async function deleteActivity(activity: Activity) {
    await axios.delete<Activity>(`/api/activities/${activity.id}`);
    handleDeleteActivity(activity);
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
                />
                <Button
                  floated='right'
                  content='Delete'
                  color='red'
                  onClick={() => deleteActivity(activity)}
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
