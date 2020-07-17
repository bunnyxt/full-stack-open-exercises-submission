const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')

morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/info', (req, res) => {
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`);
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
})

app.post('/api/persons', (req, res) => {
  const person = req.body;
  person.id = Math.floor(Math.random() * 999999999);  // warn: maybe have duplicate id

  if (!person.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  } else if (!person.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  } else {
    const personWithSameName = persons.find(p => p.name === person.name);
    if (personWithSameName) {
      return res.status(400).json({ 
        error: 'name must be unique' 
      })
    } else {
      persons = persons.concat(person);
      res.json(person);
    }
  }
})

const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
