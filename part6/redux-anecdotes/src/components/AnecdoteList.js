import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification} from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    let filteredAnecdotes = state.anecdote
    if (state.filter !== '') {
      filteredAnecdotes = filteredAnecdotes.filter(anecdote => anecdote.content.indexOf(state.filter) !== -1)
    }
    return filteredAnecdotes.sort((a, b) => b.votes - a.votes)
  })

  const vote = (id, content) => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`you voted '${content}'`, 5))
  }
  
  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList