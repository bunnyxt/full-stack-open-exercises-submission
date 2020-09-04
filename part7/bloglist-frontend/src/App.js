import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [promptType, setPromptType] = useState('success')
  // const [promptMessage, setPromptMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

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
      // setPromptType('error')
      // setPromptMessage('wrong username or password')
      // setTimeout(() => {
      //   setPromptMessage(null)
      // }, 5000)
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
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      // setPromptType('success')
      // setPromptMessage(`a new blog ${returnedBlog.title} added`)
      // setTimeout(() => {
      //   setPromptMessage(null)
      // }, 5000)
      dispatch(setNotification(`a new blog ${returnedBlog.title} added`, 'success'))
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      // setPromptType('error')
      // setPromptMessage('fail to create new blog, please check input')
      // setTimeout(() => {
      //   setPromptMessage(null)
      // }, 5000)
      dispatch(setNotification('fail to create new blog, please check input', 'error'))
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)

      setBlogs(blogs.map(blog => 
        blog.id === id 
        ? { ...returnedBlog, user: blog.user } 
        : blog)
      )

      // setPromptType('success')
      // setPromptMessage(`blog ${returnedBlog.title} updated`)
      // setTimeout(() => {
      //   setPromptMessage(null)
      // }, 5000)
      dispatch(setNotification(`blog ${returnedBlog.title} updated`, 'success'))
    } catch (exception) {
      // setPromptType('error')
      // setPromptMessage(`fail to update blog ${blogObject.title}, please check input`)
      // setTimeout(() => {
      //   setPromptMessage(null)
      // }, 5000)
      dispatch(setNotification(`fail to update blog ${blogObject.title}, please check input`, 'error'))
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      await blogService.delete(blogToDelete.id)

      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))

      // setPromptType('success')
      // setPromptMessage(`blog ${blogToDelete.title} removed`)
      // setTimeout(() => {
      //   setPromptMessage(null)
      // }, 5000)
      dispatch(setNotification(`blog ${blogToDelete.title} removed`, 'success'))
    } catch (exception) {
      // setPromptType('error')
      // setPromptMessage(`fail to remove blog ${blogToDelete.title}`)
      // setTimeout(() => {
      //   setPromptMessage(null)
      // }, 5000)
      dispatch(setNotification(`fail to remove blog ${blogToDelete.title}`, 'error'))
    }
  }

  const blogsOrderByLikes = blogs.sort((a, b) => 
    b.likes - a.likes
  )

  const blogsForm = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout} >logout</button></p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <div className='blogs'>
        {blogsOrderByLikes.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
        )}
      </div>
    </div>
  )

  return (
    <div>
      {/* {
        promptMessage && 
        <div className={`prompt prompt-${promptType}`}>
          {promptMessage}
        </div>
      } */}
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