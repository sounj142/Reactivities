import { FieldHelperProps, FieldInputProps } from 'formik';
import { FieldCommonLogic } from './FieldCommonLogic';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

export default function MyDateTimePicker(props: Partial<ReactDatePickerProps>) {
  const renderInputElement = (
    field: FieldInputProps<any>,
    helpers?: FieldHelperProps<any>
  ) => (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={(value) => helpers?.setValue(value)}
    />
  );
  return FieldCommonLogic({
    name: props.name!,
    renderInputElement,
  });
}
