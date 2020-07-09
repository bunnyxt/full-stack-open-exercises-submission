import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] =  useState(Array(anecdotes.length).fill(0));
  const [mostVoted, setMostVoted] = useState(0);

  const nextAnecdoteClickHandler = () => {
    while (true) {
      const next = Math.floor(Math.random() * (anecdotes.length - 1));
      // ensure next index different from current selected index
      if (next !== selected) {
        setSelected(next);
        break;
      }
    }
  }

  const voteClickHandler = () => {
    const newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);
    // update most voted
    if (newVotes[selected] > newVotes[mostVoted]) {
      setMostVoted(selected);
    }
  }

  return (
    <div>
      <h1>Anecdode of the day</h1>
      {props.anecdotes[selected]}<br />
      has {votes[selected]} votes<br />
      <Button onClick={voteClickHandler} text='vote' />
      <Button onClick={nextAnecdoteClickHandler} text='next anecdote' />
      <h1>Anecdode with most votes</h1>
      {props.anecdotes[mostVoted]}<br />
      has {votes[mostVoted]} votes<br />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)