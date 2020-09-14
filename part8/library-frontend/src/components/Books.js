import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const genres = []
  books.forEach(book => {
    const bookGenres = book.genres
    bookGenres.forEach(genre => {
      if (genres.indexOf(genre) === -1) {
        genres.push(genre)
      }
    })
  })
  const booksToShow = genre
    ? books.filter(book => book.genres.indexOf(genre) !== -1)
    : books 

  return (
    <div>
      <h2>books</h2>

      {genre
        ? <>in genre <b>{genre}</b></>
        : <>in all genres</>
      }

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      {genres.map(genre => 
        <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
      )}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books