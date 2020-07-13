import React from 'react'

const Person = ({ person, deleteButtonClickHandler }) =>
  <div>
    {person.name} {person.number}  <button id={person.id} name={person.name} onClick={deleteButtonClickHandler}>delete</button>
  </div>

export default Person
