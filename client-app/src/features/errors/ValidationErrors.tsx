import { Message } from 'semantic-ui-react';

interface Props {
  serverResponse: any;
}

export default function ValidationErrors({ serverResponse }: Props) {
  if (typeof serverResponse === 'string')
    return (
      <Message error className='error-messages'>
        <Message.Item>{serverResponse}</Message.Item>
      </Message>
    );
  if (serverResponse?.errors) {
    return (
      <Message error className='error-messages'>
        {Object.values(serverResponse.errors).map((errs: any) => {
          return errs.map((err: string) => (
            <Message.Item key={err}>{err}</Message.Item>
          ));
        })}
      </Message>
    );
  }
  return (
    <Message error className='error-messages'>
      <Message.Item>Unknown Error.</Message.Item>
    </Message>
  );
}
