import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
  }
}
`

const UPDATE_AUTHOR_BIRTH_YEAR = gql`
mutation updateAuthorBirthYear($name: String!, $setBornTo: Int!) {
  editAuthor (
    name: $name, 
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}
`

const Authors = (props) => {
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [newBirthYear, setNewBirthYear] = useState('')
  const [ updateAuthorBirthYear ] = useMutation(UPDATE_AUTHOR_BIRTH_YEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  const goUpdateAuthorBirthYear = () => {
    updateAuthorBirthYear({ variables: { name: selectedAuthor, setBornTo: Number(newBirthYear) } })
    setNewBirthYear('')
  }
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <select value={selectedAuthor} onChange={e => setSelectedAuthor(e.target.value)}>
        {authors.map(a => 
          <option key={a.name} value={a.name}>{a.name}</option>
        )}
      </select>
      <div>
        born<input type='number' value={newBirthYear} onChange={e => setNewBirthYear(e.target.value)} />
      </div>
      <button onClick={goUpdateAuthorBirthYear}>update author</button>
    </div>
  )
}

export default Authors
