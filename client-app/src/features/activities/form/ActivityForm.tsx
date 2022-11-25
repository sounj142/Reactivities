import { observer } from 'mobx-react-lite';
import { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import Activity, { emptyActivity } from '../../../models/Activity';
import { useStore } from '../../../stores/store';

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const actionName = activityStore.selectedActivity ? 'Update' : 'Create';

  const initialActivity: Activity = activityStore.selectedActivity
    ? { ...activityStore.selectedActivity }
    : emptyActivity();
  const [activity, setActivity] = useState(initialActivity);

  function handleInputChanged(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  return (
    <Segment clearing>
      <Form
        onSubmit={() => activityStore.createOrUpdateActivity(activity)}
        autoComplete='off'
      >
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
        />
        <Button
          floated='right'
          type='button'
          content='Cancel'
          onClick={activityStore.handleFormClose}
        />
      </Form>
    </Segment>
  );
});
