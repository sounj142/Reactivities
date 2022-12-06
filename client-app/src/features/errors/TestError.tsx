import { useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { requests } from '../../api/agent';
import { ignoreStatusCodes } from '../../utils/axios';
import ValidationErrors from './ValidationErrors';

export default function TestErrors() {
  const [serverResponse, setServerResponse] = useState<any>(undefined);

  function handleNotFound() {
    requests.get('/buggy/not-found').catch((err) => console.log(err.response));
  }

  function handleDefaultNotFound() {
    requests
      .get('/buggy/default-not-found')
      .catch((err) => console.log(err.response));
  }

  function handle404Url() {
    requests.get('/not-exist-url').catch((err) => console.log(err.response));
  }

  function handleBadRequest() {
    requests
      .get('/buggy/bad-request')
      .catch((err) => console.log(err.response));
  }

  function handleDefaultBadRequest() {
    requests
      .get('/buggy/default-bad-request')
      .catch((err) => console.log(err.response));
  }

  function handleServerError() {
    requests
      .get('/buggy/server-error')
      .catch((err) => console.log(err.response));
  }

  function handleUnauthorised() {
    requests
      .get('/buggy/unauthorised')
      .catch((err) => console.log(err.response));
  }

  function handleBadGuid() {
    requests
      .get('/activities/notaguid')
      .catch((err) => console.log(err.response));
  }

  function handleValidationError() {
    requests
      .post('/activities', {}, ignoreStatusCodes())
      .catch((err) => setServerResponse(err.response.data));
  }

  return (
    <>
      <Header as='h1' content='Test Errors component' />
      <Segment>
        <Button.Group widths='16'>
          <Button onClick={handleNotFound} content='Not Found' basic primary />
          <Button
            onClick={handleDefaultNotFound}
            content='Default Not Found'
            basic
            primary
          />
          <Button onClick={handle404Url} content='404' basic primary />
          <Button
            onClick={handleBadRequest}
            content='Bad Request'
            basic
            primary
          />
          <Button
            onClick={handleDefaultBadRequest}
            content='Default Bad Request'
            basic
            primary
          />
          <Button
            onClick={handleValidationError}
            content='Validation Error'
            basic
            primary
          />
          <Button
            onClick={handleServerError}
            content='Server Error'
            basic
            primary
          />
          <Button
            onClick={handleUnauthorised}
            content='Unauthorised'
            basic
            primary
          />
          <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
        </Button.Group>
      </Segment>

      {serverResponse && (
        <ValidationErrors serverResponse={serverResponse} />
      )}
    </>
  );
}
