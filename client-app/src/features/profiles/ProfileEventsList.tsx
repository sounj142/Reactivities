import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';
import { ActivityFilterPredicateType } from '../../models/ActivityMinimumInfo';
import { useStore } from '../../stores/store';
import { formatDate, formatTime, getImageUrl } from '../../utils/common';

interface Props {
  userName: string;
  predicate: ActivityFilterPredicateType;
}
export default observer(function ProfileEventsList({
  userName,
  predicate,
}: Props) {
  const { profileStore } = useStore();
  const { events } = profileStore;

  useEffect(() => {
    profileStore.getEvents(userName, predicate);
    return () => {
      profileStore.setEvents([]);
    };
  }, [userName, predicate, profileStore]);

  return (
    <Card.Group itemsPerRow={4}>
      {events.map((activity) => (
        <Card key={activity.id} as={Link} to={`/activities/${activity.id}`}>
          <Image
            src={getImageUrl(activity.category)}
            style={{ minHeight: 100 }}
          />

          <Card.Content textAlign='center'>
            <Card.Header>{activity.title}</Card.Header>
            <Card.Description>
              {formatDate(activity.date)}
              <br />
              {formatTime(activity.date)}
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
});
