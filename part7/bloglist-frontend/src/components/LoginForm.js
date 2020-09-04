import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => (
  <div>
    <h2>log in to application</h2>
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>username</Form.Label>
        <Form.Control
          id='username'
          type="text"
          name="Username"
          value={username}
          onChange={({ target }) => handleUsernameChange(target.value)}
        />
        <Form.Label>password</Form.Label>
        <Form.Control
          id='password'
          type="password"
          name="Password"
          value={password}
          onChange={({ target }) => handlePasswordChange(target.value)}
        />
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form.Group>
    </Form>
  </div>
)

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm