import { observer } from 'mobx-react-lite';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';

export default observer(function ActivitiesList() {
  const { activityStore } = useStore();
  const { activities, viewButtonHandle, deletingId, deleteActivity } =
    activityStore;

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
});
