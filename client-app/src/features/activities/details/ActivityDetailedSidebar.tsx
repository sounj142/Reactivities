import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Item, Label, List, Segment, Image } from 'semantic-ui-react';
import ActivityAttendee from '../../../models/ActivityAttendee';

interface Props {
  attendees: ActivityAttendee[];
}

export default observer(function ActivityDetailedSidebar({ attendees }: Props) {
  return (
    <>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {attendees.length}{' '}
        {attendees.length === 1 ? 'Person Going' : 'People Going'}
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map((attendee) => (
            <Item style={{ position: 'relative' }} key={attendee.userName}>
              {attendee.isHost && (
                <Label
                  style={{ position: 'absolute' }}
                  color='orange'
                  ribbon='right'
                >
                  Host
                </Label>
              )}

              <Image size='tiny' src={attendee.image || '/assets/user.png'} />

              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <Link to={`/profiles/${attendee.userName}`}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
                {/* <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra> */}
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </>
  );
});
