import { Message } from 'semantic-ui-react';

interface Props {
  serverResponse: any;
}

export default function ValidationErrors({ serverResponse }: Props) {
  if (typeof serverResponse === 'string')
    return (
      <Message error>
        <Message.Item>{serverResponse}</Message.Item>
      </Message>
    );
  if (serverResponse?.errors) {
    return (
      <Message error>
        {Object.values(serverResponse.errors).map((errs: any) => {
          return errs.map((err: string) => (
            <Message.Item key={err}>{err}</Message.Item>
          ));
        })}
      </Message>
    );
  }
  return (
    <Message error>
      <Message.Item>Unknown Error.</Message.Item>
    </Message>
  );
}
