import React from 'react'
import { useSelector } from 'react-redux'

import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification) {
    let variant = 'info'
    switch (notification.type) {
      case 'success':
        variant = 'success'
        break
      case 'error':
        variant = 'danger'
        break
    }
    return (
      <Alert variant={variant}>
        {notification.content}
      </Alert>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default Notification