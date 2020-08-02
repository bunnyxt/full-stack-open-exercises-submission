import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'bunnyxt\'s cheat sheet',
    author: 'bunnyxt',
    url: 'https://bcs.bunnyxt.com',
    likes: 2,
    user: {
      name: 'bunnyxt',
      username: 'bunnyxt'
    }
  }
  let component
  const updateMockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={blog} updateBlog={updateMockHandler} />
    )
  })

  test('show blog content less initially', () => {
    const lessDiv = component.container.querySelector('.blog-content-less')
    expect(lessDiv).not.toHaveStyle('display: none')
  
    const moreDiv = component.container.querySelector('.blog-content-more')
    expect(moreDiv).toHaveStyle('display: none')
  })

  test('show url and likes after click button', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const lessDiv = component.container.querySelector('.blog-content-less')
    expect(lessDiv).toHaveStyle('display: none')
  
    const moreDiv = component.container.querySelector('.blog-content-more')
    expect(moreDiv).not.toHaveStyle('display: none')
  })

  test('twice click like button, func will run twice', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const moreDiv = component.container.querySelector('.blog-content-more')
    const likeButton = moreDiv.querySelector('.like-button')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(updateMockHandler.mock.calls).toHaveLength(2)
  })
})

