import React from 'react'
import Person from './Person'

const Persons = ({ persons, deleteButtonClickHandler }) => 
  persons.map(person => 
    <Person key={person.name} person={person} deleteButtonClickHandler={deleteButtonClickHandler} />
  )

export default Persons
