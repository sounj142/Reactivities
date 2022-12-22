import { Message } from 'semantic-ui-react';

interface Props {
  serverResponse: any;
}
export default function ValidationErrors({ serverResponse }: Props) {
  if (typeof serverResponse === 'string')
    return (
      <Message error className='error-messages'>
        {serverResponse}
      </Message>
    );

  if (serverResponse?.errors) {
    const errors = [].concat.apply([], Object.values(serverResponse.errors));
    return (
      <Message error className='error-messages'>
        {errors.length < 2
          ? errors[0]
          : errors.map((err: string, index: number) => (
              <Message.Item key={index}>{err}</Message.Item>
            ))}
      </Message>
    );
  }

  return (
    <Message error className='error-messages'>
      Unknown Error.
    </Message>
  );
}
