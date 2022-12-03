import { Message } from 'semantic-ui-react';
import ValidationError from '../../models/ValidationError';

interface Props {
  errors: ValidationError;
}

export default function ValidationErrorsPanel({ errors }: Props) {
  return (
    <Message error>
      {Object.values(errors).map((errs) => {
        return errs.map((err) => <Message.Item key={err}>{err}</Message.Item>);
      })}
    </Message>
  );
}
