import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

const Recommend = (props) => {
  const meResult = useQuery(ME)
  const allBooksResult = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (meResult.loading)  {
    return <div>loading...</div>
  }
  if (allBooksResult.loading)  {
    return <div>loading...</div>
  }

  const me = meResult.data.me
  const allBooks = allBooksResult.data.allBooks
  const booksToShow = allBooks.filter(book => book.genres.indexOf(me.favoriteGenre) !== -1)

  return (
    <div>
      <h2>recommendations</h2>
      
      <div>books in your favorite genre <b>{me.favoriteGenre}</b></div>

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
    </div>
  )
}

export default Recommend