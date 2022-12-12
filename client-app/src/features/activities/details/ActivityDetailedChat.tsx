import { formatDistanceToNow } from 'date-fns';
import { Field, FieldProps, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment, Comment, Loader } from 'semantic-ui-react';
import * as Yup from 'yup';
import Activity from '../../../models/Activity';
import { CommentCreate } from '../../../models/Comment';
import { useStore } from '../../../stores/store';
import ValidationErrors from '../../errors/ValidationErrors';

interface Props {
  activity: Activity;
}
export default observer(function ActivityDetailedChat({ activity }: Props) {
  const [timer, setTimer] = useState(Date.now());
  const { commentStore } = useStore();
  const initialValue: CommentCreate = {
    body: '',
    activityId: activity.id,
  };

  const validationSchema = Yup.object({
    body: Yup.string()
      .required('Comment is required.')
      .max(10000, 'Comment must not exceed 10000 characters.'),
  });
  console.log('rerunnnn!');

  useEffect(() => {
    const interval = setInterval(() => setTimer(Date.now()), 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    commentStore.createHubConnection(activity.id);

    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, activity.id]);

  async function formSubmitHandle(
    model: CommentCreate,
    resetForm: (...args: any) => any
  ) {
    await commentStore.createComment(model);
    resetForm();
  }

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
      <Segment attached clearing>
        {timer && commentStore.commentCreatingError && (
          <ValidationErrors
            serverResponse={commentStore.commentCreatingError}
          />
        )}

        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) =>
            formSubmitHandle(values, resetForm)
          }
        >
          {({ isValid, isSubmitting, handleSubmit }) => (
            <Form className='ui form' autoComplete='off'>
              <Field name='body'>
                {(props: FieldProps) => (
                  <div style={{ position: 'relative' }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder='Enter your comment(Enter to submit, SHILT+Enter for new line)'
                      rows={3}
                      {...props.field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          isValid && handleSubmit();
                        }
                        return;
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>

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
                  <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                </Comment.Metadata>
                <Comment.Text className='display-linebreak'>
                  {comment.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
});
