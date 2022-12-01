import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../../../app/layouts/Loading';
import { useStore } from '../../../stores/store';
import { getImageUrl } from '../../../utils/common';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    activityStore.loadActivity(id);
  }, [activityStore, id]);

  const activity = activityStore.selectedActivity;

  if (activity)
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
              as={Link}
              to={`/activities/edit/${activity.id}`}
            />
            <Button
              basic
              color='grey'
              content='Cancel'
              as={Link}
              to='/activities'
            />
          </Button.Group>
        </Card.Content>
      </Card>
    );
  else return <Loading />;
});
