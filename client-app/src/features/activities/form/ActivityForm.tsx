import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import Activity, {
  ActivityModel,
  emptyActivity,
  mapToActivityModel,
} from '../../../models/Activity';
import { useStore } from '../../../stores/store';
import Loading from '../../../app/layouts/Loading';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/form/MyTextInput';
import MyTextArea from '../../../app/form/MyTextArea';
import MySelectInput from '../../../app/form/MySelectInput';
import categoryOptions from '../../../models/CategoryOptions';
import MyDateTimePicker from '../../../app/form/MyDateTimePicker';
import ValidationErrors from '../../errors/ValidationErrors';

export default observer(function ActivityForm() {
  const { id } = useParams<{ id?: string }>();
  const { activityStore } = useStore();
  const actionName = id ? 'Update' : 'Create';
  const history = useHistory();
  const [initialActivity, setInitialActivity] = useState(emptyActivity());
  const [serverResponse, setServerResponse] = useState<any>(undefined);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required.')
      .max(200, 'Title must not exceed 200 characters.'),
    date: Yup.string().nullable().required('Date is required.'),
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
      activityStore.changeSelectedActivity(undefined);
    }
    if (id) {
      if (activityStore.selectedActivity?.id === id) {
        setInitialActivity(mapToActivityModel(activityStore.selectedActivity));
      } else {
        activityStore.loadActivity(id).then(() => {
          setInitialActivity(
            mapToActivityModel(activityStore.selectedActivity!)
          );
        });
      }
    }
  }, [activityStore, id]);

  async function formSubmitHandle(activity: ActivityModel) {
    setServerResponse(undefined);
    try {
      await activityStore.createOrUpdateActivity(activity as Activity);
      history.push(`/activities/${activity.id}`);
    } catch (err: any) {
      setServerResponse(err.response?.data);
    }
  }

  function navigateToParentPage() {
    history.push(id ? `/activities/${initialActivity.id}` : '/activities');
  }

  if (id && !activityStore.selectedActivity) return <Loading />;
  else
    return (
      <Segment clearing>
        {serverResponse && <ValidationErrors serverResponse={serverResponse} />}
        <Header content='Activity Details' sub color='teal' />
        <Formik
          initialValues={initialActivity}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={formSubmitHandle}
        >
          {({ isValid, isSubmitting, dirty }) => (
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

              <Header content='Location Details' sub color='teal' />
              <MyTextInput placeholder='City' name='city' />
              <MyTextInput placeholder='Venue' name='venue' />

              <Button
                floated='right'
                positive
                type='submit'
                content={actionName}
                loading={isSubmitting}
                disabled={!isValid || !dirty || isSubmitting}
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
