const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save()
  }
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
  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
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
  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    // likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  // new blog added
  expect(response.body[response.body.length - 1].likes).toEqual(0)
})

// add blog without title
test('blog without title will not added', async () => {
  const newBlog = {
    // title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

// add blog without url
test('blog without url will not added', async () => {
  const newBlog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    // url: 'bcs.bunnyxt.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})