import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const vote = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  const anecdoteBeforeVote = response.data
  const anecdoteAfterVote = await axios.put(`${baseUrl}/${id}`, {
    ...anecdoteBeforeVote,
    votes: anecdoteBeforeVote.votes + 1
  })
  return anecdoteAfterVote
}

export default { getAll, createNew, vote }