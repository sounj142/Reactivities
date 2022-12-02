import axios from 'axios';
import { Button, Header, Segment } from 'semantic-ui-react';

export default function TestErrors() {
  function handleNotFound() {
    axios.get('/buggy/not-found').catch(err => console.log(err.response));
  }

  function handleDefaultNotFound() {
    axios.get('/buggy/default-not-found').catch(err => console.log(err.response));
  }

  function handleBadRequest() {
    axios.get('/buggy/bad-request').catch(err => console.log(err.response));
  }

  function handleDefaultBadRequest() {
    axios.get('/buggy/default-bad-request').catch(err => console.log(err.response));
  }

  function handleServerError() {
    axios.get('/buggy/server-error').catch(err => console.log(err.response));
  }

  function handleUnauthorised() {
    axios.get('/buggy/unauthorised').catch(err => console.log(err.response));
  }

  function handleBadGuid() {
    axios.get('/activities/notaguid').catch(err => console.log(err.response));
  }

  function handleValidationError() {
    axios.post('/activities', {}).catch(err => console.log(err.response));
  }

  return (
    <>
      <Header as='h1' content='Test Error component' />
      <Segment>
        <Button.Group widths='16'>
          <Button onClick={handleNotFound} content='Not Found' basic primary />
          <Button onClick={handleDefaultNotFound} content='Default Not Found' basic primary />
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
    </>
  );
}
