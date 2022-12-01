import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import { emptyActivity } from '../../../models/Activity';
import { useStore } from '../../../stores/store';
import Loading from '../../../app/layouts/Loading';

export default observer(function ActivityForm() {
  const { id } = useParams<{ id?: string }>();
  const { activityStore } = useStore();
  const actionName = id ? 'Update' : 'Create';
  const history = useHistory();
  const [activity, setActivity] = useState(emptyActivity());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activityStore.selectedActivity?.id !== id) {
      activityStore.changeActivity(undefined);
    }
    if (id) {
      activityStore.loadActivity(id).then(() => {
        setActivity({ ...activityStore.selectedActivity! });
      });
    }
  }, [activityStore, id]);

  function handleInputChanged(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  function navigateToParentPage() {
    history.push(id ? `/activities/details/${activity.id}` : '/activities');
  }

  async function formSubmitHandle() {
    setIsSubmitting(true);
    await activityStore.createOrUpdateActivity(activity);
    history.push(`/activities/details/${activity.id}`);
  }

  if (id && !activityStore.selectedActivity) return <Loading />;
  else
    return (
      <Segment clearing>
        <Form onSubmit={formSubmitHandle} autoComplete='off'>
          <Form.Input
            placeholder='Title'
            value={activity.title}
            name='title'
            onChange={handleInputChanged}
          />
          <Form.TextArea
            placeholder='Description'
            value={activity.description}
            name='description'
            onChange={handleInputChanged}
          />
          <Form.Input
            placeholder='Category'
            value={activity.category}
            name='category'
            onChange={handleInputChanged}
          />
          <Form.Input
            type='date'
            placeholder='Date'
            value={activity.date}
            name='date'
            onChange={handleInputChanged}
          />
          <Form.Input
            placeholder='City'
            value={activity.city}
            name='city'
            onChange={handleInputChanged}
          />
          <Form.Input
            placeholder='Venue'
            value={activity.venue}
            name='venue'
            onChange={handleInputChanged}
          />

          <Button
            floated='right'
            positive
            type='submit'
            content={actionName}
            loading={activityStore.formSubmitting}
            disabled={isSubmitting}
          />
          <Button
            floated='right'
            type='button'
            content='Cancel'
            onClick={navigateToParentPage}
            disabled={isSubmitting}
          />
        </Form>
      </Segment>
    );
});
