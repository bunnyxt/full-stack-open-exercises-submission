const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const setNotification = (notification, delay) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification
    })
    await new Promise((resolve) => setTimeout(resolve, delay * 1000))
    dispatch({
      type: 'CLEAR_NOTIFICATION'
    })
  }
}

export default notificationReducer