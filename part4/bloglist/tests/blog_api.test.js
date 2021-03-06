const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save()
  }

  await User.deleteMany({})
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('passwd', saltRounds)
  const user = new User({
    username: 'bunnyxt',
    name: 'bunnyxt',
    passwordHash: passwordHash
  })
  await user.save()
})

test('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('all blogs have property id defined', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => expect(blog.id).toBeDefined())
})

test('new blog can be added', async () => {
  const loginResult = await api
    .post('/api/login')
    .send({
      'username': 'bunnyxt',
      'password': 'passwd'
    })
  const token = loginResult.body.token

  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  // legnth + 1
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

  // new blog added
  expect(response.body[response.body.length - 1]).toMatchObject(newBlog)
})

test('new blog without property likes, set to default 0', async () => {
  const loginResult = await api
    .post('/api/login')
    .send({
      'username': 'bunnyxt',
      'password': 'passwd'
    })
  const token = loginResult.body.token

  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    // likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  // new blog added
  expect(response.body[response.body.length - 1].likes).toEqual(0)
})

test('blog without title will not added', async () => {
  const loginResult = await api
    .post('/api/login')
    .send({
      'username': 'bunnyxt',
      'password': 'passwd'
    })
  const token = loginResult.body.token

  const newBlog = {
    // title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog without url will not added', async () => {
  const loginResult = await api
    .post('/api/login')
    .send({
      'username': 'bunnyxt',
      'password': 'passwd'
    })
  const token = loginResult.body.token

  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    // url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('delete blog by id', async () => {
  const loginResult = await api
    .post('/api/login')
    .send({
      'username': 'bunnyxt',
      'password': 'passwd'
    })
  const token = loginResult.body.token

  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogs = response.body
  const blogToBeDeleted = blogs[blogs.length - 1]

  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204)

  const afterDeleteResponse = await api.get('/api/blogs')
  const afterDeleteBlogs = afterDeleteResponse.body
  
  expect(afterDeleteBlogs).toEqual(
    expect.not.arrayContaining([blogToBeDeleted])
  )
})

test('update blog by id', async () => {
  const oriResponse = await api.get('/api/blogs')
  const oriBlogs = oriResponse.body
  const blogToBeUpdated = oriBlogs[0]
  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    likes: 2
  }

  const updatedResponse = await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(newBlog)
    .expect(200)
  const updatedBlog = updatedResponse.body

  expect(updatedBlog).toMatchObject(newBlog)

  const afterUpdateResponse = await api.get(`/api/blogs/${blogToBeUpdated.id}`)
  const afterUpdateBlog = afterUpdateResponse.body
  
  expect(afterUpdateBlog).toMatchObject(newBlog)
})

test('update blog by id without title', async () => {
  const oriResponse = await api.get('/api/blogs')
  const oriBlogs = oriResponse.body
  const blogToBeUpdated = oriBlogs[0]
  const newBlog = {
    // title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(newBlog)
    .expect(400)

  const afterUpdateResponse = await api.get(`/api/blogs/${blogToBeUpdated.id}`)
  const afterUpdateBlog = afterUpdateResponse.body
  
  expect(afterUpdateBlog).toMatchObject(blogToBeUpdated)
})

test('update blog by id without url', async () => {
  const oriResponse = await api.get('/api/blogs')
  const oriBlogs = oriResponse.body
  const blogToBeUpdated = oriBlogs[0]
  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    // url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(newBlog)
    .expect(400)

  const afterUpdateResponse = await api.get(`/api/blogs/${blogToBeUpdated.id}`)
  const afterUpdateBlog = afterUpdateResponse.body
  
  expect(afterUpdateBlog).toMatchObject(blogToBeUpdated)
})

afterAll(() => {
  mongoose.connection.close()
})