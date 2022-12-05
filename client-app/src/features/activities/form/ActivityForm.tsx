import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import { emptyActivity } from '../../../models/Activity';
import { useStore } from '../../../stores/store';
import Loading from '../../../app/layouts/Loading';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/form/MyTextInput';
import MyTextArea from '../../../app/form/MyTextArea';
import MySelectInput from '../../../app/form/MySelectInput';
import categoryOptions from '../../../models/CategoryOptions';
import MyDateTimePicker from '../../../app/form/MyDateTimePicker';

export default observer(function ActivityForm() {
  const { id } = useParams<{ id?: string }>();
  const { activityStore } = useStore();
  const actionName = id ? 'Update' : 'Create';
  const history = useHistory();
  const [initialActivity, setInitialActivity] = useState(emptyActivity());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required.')
      .max(200, 'Title must not exceed 200 characters.'),
    date: Yup.string().required('Date is required.'),
    description: Yup.string()
      .required('Description is required.')
      .max(1000, 'Description must not exceed 1000 characters.'),
    category: Yup.string()
      .required('Category is required.')
      .max(200, 'Category must not exceed 200 characters.'),
    city: Yup.string()
      .required('City is required.')
      .max(200, 'City must not exceed 200 characters.'),
    venue: Yup.string()
      .required('Venue is required.')
      .max(200, 'Venue must not exceed 200 characters.'),
  });

  useEffect(() => {
    if (activityStore.selectedActivity?.id !== id) {
      activityStore.changeActivity(undefined);
    }
    if (id) {
      activityStore.loadActivity(id).then(() => {
        setInitialActivity({ ...activityStore.selectedActivity! });
      });
    }
  }, [activityStore, id]);

  // async function formSubmitHandle() {
  //   setIsSubmitting(true);
  //   await activityStore.createOrUpdateActivity(activity);
  //   history.push(`/activities/${activity.id}`);
  // }

  function navigateToParentPage() {
    history.push(id ? `/activities/${initialActivity.id}` : '/activities');
  }

  if (id && !activityStore.selectedActivity) return <Loading />;
  else
    return (
      <Segment clearing>
        <Formik
          initialValues={initialActivity}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {() => (
            <Form className='ui form' autoComplete='off'>
              <MyTextInput placeholder='Title' name='title' />
              <MyTextArea
                placeholder='Description'
                name='description'
                rows={3}
              />
              <MySelectInput
                placeholder='Category'
                name='category'
                options={categoryOptions}
              />
              <MyDateTimePicker
                placeholderText='Date'
                name='date'
                showTimeSelect
                timeCaption='time'
                dateFormat='MMMM d, yyyy h:mm aa'
              />
              <MyTextInput placeholder='City' name='city' />
              <MyTextInput placeholder='Venue' name='venue' />

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
          )}
        </Formik>
      </Segment>
    );
});
