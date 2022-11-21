import { Button, Item, Label, Segment } from 'semantic-ui-react';
import Activity from '../../../models/activity';

interface Props {
  activities: Activity[];
  changeActivity: (activity: Activity | undefined) => void;
}

export default function ActivitiesList({ activities, changeActivity }: Props) {
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
                  onClick={() => changeActivity(activity)}
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
