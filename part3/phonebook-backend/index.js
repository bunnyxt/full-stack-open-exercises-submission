// dotenv
require('dotenv').config()

// express
const express = require('express')
const app = express()

// middleware json
app.use(express.json())

// middleware morgan logger
const morgan = require('morgan')
morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

// middleware cors
const cors = require('cors')
app.use(cors())

// middleware static
app.use(express.static('build'))

// model
const Person = require('./models/person')

// APIs
app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
    );
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }
  
  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }

  // find person with same name
  Person.findOne({ name: body.name })
    .then(person => {
      if (person) {
        return res.status(400).json({
          error: 'name must be unique' 
        })
      }

      const newPreson = new Person({
        name: body.name,
        number: body.number
      })

      newPreson.save()
        .then(savedPerson => {
          res.json(savedPerson)
        })
    })
    .catch(error => {
      console.log(error)
      res.status(400).end()
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  } 

  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

// start
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
