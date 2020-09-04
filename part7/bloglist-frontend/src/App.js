import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'

import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import { initializeBlogs, createNewBlog, updateOldBlog, deleteOldBlog } from './reducers/blogReducer'
import { loadFromLocalStorage, userLogin, userLogout } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blog).sort((a, b) => 
    b.likes - a.likes
  )
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(loadFromLocalStorage())
  }, [dispatch])

  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(userLogin(username, password))
  }

  const handleLogout = () => {
    dispatch(userLogout())
  }

  const blogFormRef = useRef()

  const createBlog = (blogObject) => {
    dispatch(createNewBlog(blogObject))
    // TODO
    // blogFormRef.current.toggleVisibility()
  }

  const updateBlog = (id, blogObject) => {
    dispatch(updateOldBlog(id, blogObject))
  }

  const deleteBlog = (blogToDelete) => {
    dispatch(deleteOldBlog(blogToDelete))
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