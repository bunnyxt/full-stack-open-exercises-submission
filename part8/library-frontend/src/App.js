import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useApolloClient } from '@apollo/client'

const Notify = ({ errorMessage }) => {
  if ( !errorMessage ) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  useEffect(() => {
    const localToken = localStorage.getItem('library-user-token')
    if (localToken) {
      setToken(localToken)
      
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token 
          ? <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommend')}>recommend</button>
              <button onClick={() => logout()}>logout</button>
            </>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <Recommend
        show={page === 'recommend'}
      />

      {page === 'login'
        ? <div>
            <Notify errorMessage={errorMessage} />
            <LoginForm
              setToken={setToken}
              setError={notify}
              setPage={setPage}
            />
          </div>
        : <>
          </>
      }
    </div>
  )
}

export default App