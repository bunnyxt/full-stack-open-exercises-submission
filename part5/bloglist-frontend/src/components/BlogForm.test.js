import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  const mockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <BlogForm createBlog={mockHandler} />
    )
  })

  test('create function correctly get parameters', () => {
    const form = component.container.querySelector('#form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    const titleValue = 'bunnyxt \'s cheat sheet'
    const authorValue = 'bunnyxt'
    const urlValue = 'https://bcs.bunnyxt.com'

    fireEvent.change(title, { 
      target: { value: titleValue } 
    })
    fireEvent.change(author, { 
      target: { value: authorValue } 
    })
    fireEvent.change(url, { 
      target: { value: urlValue } 
    })
    fireEvent.submit(form)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe(titleValue)
    expect(mockHandler.mock.calls[0][0].author).toBe(authorValue)
    expect(mockHandler.mock.calls[0][0].url).toBe(urlValue)
  })
})