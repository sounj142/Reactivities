import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment, Comment, Form, Button } from 'semantic-ui-react';
import Activity from '../../../models/Activity';
import { useStore } from '../../../stores/store';

interface Props {
  activity: Activity;
}
export default observer(function ActivityDetailedChat({ activity }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    console.log('creating hub connection');
    commentStore.createHubConnection(activity.id);

    return () => {
      console.log('stoping hub connection');
      commentStore.clearComments();
    };
  }, [commentStore, activity.id]);

  return (
    <>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='teal'
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.authorImage || '/assets/user.png'} />
              <Comment.Content>
                <Comment.Author
                  as={Link}
                  to={`/profiles/${comment.authorUserName}`}
                >
                  {comment.authorDisplayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{comment.createdAt.toString()}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}

          <Form reply>
            <Form.TextArea />
            <Button
              content='Add Reply'
              labelPosition='left'
              icon='edit'
              primary
            />
          </Form>
        </Comment.Group>
      </Segment>
    </>
  );
});
