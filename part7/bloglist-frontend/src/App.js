import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import Notification from './components/Notification'
import { initializeBlogs, createNewBlog, updateOldBlog, deleteOldBlog } from './reducers/blogReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blog).sort((a, b) => 
    b.likes - a.likes
  )

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 'error'))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const blogFormRef = useRef()

  const createBlog = async (blogObject) => {
    try {
      dispatch(createNewBlog(blogObject))
      dispatch(setNotification(`a new blog ${blogObject.title} added`, 'success'))
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      dispatch(setNotification('fail to create new blog, please check input', 'error'))
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      dispatch(updateOldBlog(id, blogObject))
      dispatch(setNotification(`blog ${blogObject.title} updated`, 'success'))
    } catch (exception) {
      dispatch(setNotification(`fail to update blog ${blogObject.title}, please check input`, 'error'))
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      dispatch(deleteOldBlog(blogToDelete.id))
      dispatch(setNotification(`blog ${blogToDelete.title} removed`, 'success'))
    } catch (exception) {
      dispatch(setNotification(`fail to remove blog ${blogToDelete.title}`, 'error'))
    }
  }

  const blogsForm = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout} >logout</button></p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
        )}
      </div>
    </div>
  )

  return (
    <div>
      <Notification />
      {
        user === null ?
        <LoginForm 
          handleSubmit={handleLogin}
          handleUsernameChange={setUsername}
          handlePasswordChange={setPassword}
          username={username} 
          password={password} 
        /> 
        :
        blogsForm()
      }
    </div>
  )
}

export default App