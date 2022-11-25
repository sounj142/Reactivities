import { observer } from 'mobx-react-lite';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import { getImageUrl } from '../../../utils/common';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const activity = activityStore.selectedActivity!;

  return (
    <Card fluid>
      <Image src={getImageUrl(activity.category)} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date.toString()}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button
            basic
            color='blue'
            content='Edit'
            onClick={() => activityStore.handleFormOpen(activity)}
          />
          <Button
            basic
            color='grey'
            content='Cancel'
            onClick={() => activityStore.changeActivity(undefined)}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
});
