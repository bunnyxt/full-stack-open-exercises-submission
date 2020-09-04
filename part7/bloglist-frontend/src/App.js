import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'

import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import { initializeBlogs, createNewBlog, updateOldBlog, deleteOldBlog, addBlogComment } from './reducers/blogReducer'
import { loadFromLocalStorage, userLogin, userLogout } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'

import {
  BrowserRouter as Router,
  Switch, Route, Link, 
  useParams
} from "react-router-dom"

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blog).sort((a, b) => 
    b.likes - a.likes
  )
  const user = useSelector(state => state.loginUser)
  const users = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
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

  const UserDetail = ({ users }) => {
    const id = useParams().id
    const user = users.find(n => n.id === String(id))
    if (!user) {
      return null
    }

    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog.id}>{blog.title}</li>
          )}
        </ul>
      </div>
    )
  }

  const BlogDetail = ({ blogs, updateBlog }) => {
    const [comment, setComment] = useState('')

    const id = useParams().id
    const blog = blogs.find(n => n.id === String(id))
    if (!blog) {
      return null
    }

    const plusBlogLike = () => {
      updateBlog(blog.id, {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      })
    }

    const addComment = () => {
      dispatch(addBlogComment(blog.id, {
        content: comment,
      }))
    }

    return (
      <div>
        <h2>{blog.title} {blog.author}</h2>
        <div><a href={blog.url} target="_blank">{blog.url}</a></div>
        <div>likes {blog.likes} <button className='like-button' onClick={plusBlogLike}>like</button></div>
        <div>added by {blog.user.name}</div>
        <h3>comments</h3>
        <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} />
        <button onClick={addComment} >add comment</button>
        <ul>
          {blog.comments.map(comment =>
            <li key={comment.id}>{comment.content}</li>
          )}
        </ul>
      </div>
    )
  }

  const blogsForm = () => (
    <div>
      <div className="nav">
        <Link to="/">blogs</Link> <Link to="/users">users</Link> {user.name} logged in <button onClick={handleLogout} >logout</button>
      </div>
      <h2>blog app</h2>
      <Switch>
        <Route path="/users/:id">
          <UserDetail users={users} />
        </Route>
        <Route path="/users">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <td></td>
                <td><b>blogs created</b></td>
              </tr>
            </thead>
            <tbody>
              {users.map(user =>
                <tr key={user.id}><td><Link to={`/users/${user.id}`}>{user.name}</Link></td><td>{user.blogs.length}</td></tr>
              )}
            </tbody>
          </table>
        </Route>
        <Route path="/blogs/:id">
          <BlogDetail blogs={blogs} updateBlog={updateBlog} />
        </Route>
        <Route path="/">
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <div>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        </Route>
      </Switch>
    </div>
  )

  return (
    <Router>
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
    </Router>
  )
}

export default App