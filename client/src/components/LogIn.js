import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Breadcrumb, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';

function LogIn({ logIn }) {
  const onSubmit = async (values, actions) => {
    try {
      const { response, isError } = await logIn(
        values.username, values.password
      );
      if (isError) {
        const data = response.response.data;
        for (const value in data) {
          if (typeof data[value] === 'string')
            actions.setFieldError(value, data[value]);
          else
            actions.setFieldError(value, data[value].join(''));
        }
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Row>
      <Col lg={12}>
        <Breadcrumb>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Log in</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>Log in</Card.Header>
          <Card.Body>
            <Formik
              initialValues={{
                username: '',
                password: ''
              }}
              onSubmit={onSubmit}>
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                values
              }) => (
                  <>
                    {
                      'detail' in errors &&
                      <Alert variant='danger'>
                        {errors['detail']}
                      </Alert>
                    }
                    <Form noValidate onSubmit={(handleSubmit)}>
                      <Form.Group controlId='username'>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                          className={'username' in errors ? 'is-invalid' : ''}
                          name='username'
                          onChange={handleChange}
                          value={values.username}
                        />
                        {
                          'username' in errors &&
                          <Form.Control.Feedback type='invalid'>
                            {errors.username}
                          </Form.Control.Feedback>
                        }
                      </Form.Group>
                      <Form.Group controlId='password'>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                          className={'password' in errors ? 'is-invalid' : ''}
                          name='password'
                          onChange={handleChange}
                          type='password'
                          value={values.password}
                        />
                        {
                          'password' in errors &&
                          <Form.Control.Feedback type='invalid'>
                            {errors.password}
                          </Form.Control.Feedback>
                        }
                      </Form.Group>
                      <Button
                        block
                        disabled={isSubmitting}
                        type='submit'
                        variant='primary'>
                        Log in
                      </Button>
                    </Form>
                  </>
                )}
            </Formik>
          </Card.Body>
          <p className='mt-3 text-center'>
            Don't have an account? <Link to='/sign-up'>Sign up!</Link>
          </p>
        </Card>
      </Col>
    </Row>
  );
}

export default LogIn;