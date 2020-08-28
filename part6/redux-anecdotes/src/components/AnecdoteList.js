import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteList = (props) => {

  const vote = (id, content) => {
    props.voteAnecdote(id)
    props.setNotification(`you voted '${content}'`, 5)
  }
  
  return (
    <div>
      {props.anecdotes.map(anecdote =>
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

const mapStateToProps = (state) => {
  let filteredAnecdotes = state.anecdote
  if (state.filter !== '') {
    filteredAnecdotes = filteredAnecdotes.filter(anecdote => anecdote.content.indexOf(state.filter) !== -1)
  }

  return {
    anecdotes: filteredAnecdotes.sort((a, b) => b.votes - a.votes)
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  setNotification
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList