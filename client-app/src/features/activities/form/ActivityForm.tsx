import { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import activityApis from '../../../api/activity-api';
import Activity, { emptyActivity } from '../../../models/Activity';

interface Props {
  selectedActivity?: Activity;
  handleFormClose: () => void;
  handleCreateOrEditActivity: (activity: Activity) => void;
}

export default function ActivityForm({
  selectedActivity,
  handleFormClose,
  handleCreateOrEditActivity,
}: Props) {
  const isEdit = !!selectedActivity;
  const actionName = isEdit ? 'Update' : 'Create';
  const initialActivity: Activity = selectedActivity
    ? { ...selectedActivity }
    : emptyActivity();
  const [activity, setActivity] = useState(initialActivity);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      if (isEdit) {
        await activityApis.update(activity);
      } else {
        await activityApis.create(activity);
      }
      handleFormClose();
      handleCreateOrEditActivity(activity);
    } finally {
      setSubmitting(false);
    }
  }

  function handleInputChanged(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete='off'>
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
          loading={submitting}
        />
        <Button
          floated='right'
          type='button'
          content='Cancel'
          onClick={handleFormClose}
        />
      </Form>
    </Segment>
  );
}
