let timeoutId = null

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      return action.notification
    case 'CLEAR_NOTIFICATION':
      return null
    case 'SET_TIMEOUT_ID':
      timeoutId = action.timeoutId
      return state
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
    
    const timeoutId = setTimeout(() => dispatch({
      type: 'CLEAR_NOTIFICATION'
    }), delay * 1000)

    dispatch({
      type: 'SET_TIMEOUT_ID',
      timeoutId
    })
  }
}

export default notificationReducer