import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification) {
    return (
      <div className={`prompt prompt-${notification.type}`}>
        {notification.content}
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default Notification