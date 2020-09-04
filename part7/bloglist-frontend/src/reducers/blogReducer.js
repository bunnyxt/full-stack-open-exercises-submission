import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'NEW_BLOG':
      return [...state, action.data]
    case 'UPDATE_BLOG':
      return state.map(
        blog => 
        blog.id === action.data.id 
        ? { ...action.data.returnedBlog, user: blog.user } 
        : blog
      )
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.data.id)
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const createNewBlog = (blogObject) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog,
      })
      dispatch(setNotification(`a new blog ${newBlog.title} added`, 'success'))
      // TODO set input text to null
    } catch (e) {
      dispatch(setNotification('fail to create new blog, please check input', 'error'))
    }
  }
}

export const updateOldBlog = (id, blogObject) => {
  return async dispatch => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      dispatch({
        type: 'UPDATE_BLOG',
        data: {
          id,
          returnedBlog,
        },
      })
      dispatch(setNotification(`blog ${returnedBlog.title} updated`, 'success'))
    } catch (e) {
      dispatch(setNotification(`fail to update blog ${blogObject.title}, please check input`, 'error'))
    }
  }
}

export const deleteOldBlog = (blogToDelete) => {
  return async dispatch => {
    try {
      await blogService.delete(blogToDelete.id)
      dispatch({
        type: 'DELETE_BLOG',
        data: {
          id: blogToDelete.id,
        }
      })
      dispatch(setNotification(`blog ${blogToDelete.title} removed`, 'success'))
    } catch (e) {
      dispatch(setNotification(`fail to remove blog ${blogToDelete.title}`, 'error'))
    } 
  }
}

export default blogReducer