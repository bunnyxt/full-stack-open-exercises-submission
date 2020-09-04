import blogService from '../services/blogs'

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
    const anecdotes = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: anecdotes,
    })
  }
}

export const createNewBlog = (blogObject) => {
  return async dispatch => {
    const newBlog = await blogService.create(blogObject)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const updateOldBlog = (id, blogObject) => {
  return async dispatch => {
    const returnedBlog = await blogService.update(id, blogObject)
    dispatch({
      type: 'UPDATE_BLOG',
      data: {
        id,
        returnedBlog,
      },
    })
  }
}

export const deleteOldBlog = (id) => {
  return async dispatch => {
    await blogService.delete(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: {
        id,
      }
    })
  }
}

export default blogReducer