import { Button, Card, Image } from 'semantic-ui-react';
import Activity from '../../../models/Activity';
import { getImageUrl } from '../../../utils/common';

interface Props {
  activity: Activity;
  changeActivity: (activity?: Activity) => void;
  handleFormOpen: (activity?: Activity) => void;
}

export default function ActivityDetails({
  activity,
  changeActivity,
  handleFormOpen,
}: Props) {
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
            onClick={() => handleFormOpen(activity)}
          />
          <Button
            basic
            color='grey'
            content='Cancel'
            onClick={() => changeActivity(undefined)}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
}
