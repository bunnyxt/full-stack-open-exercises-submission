import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');

  const newNameChangeHandler = (event) => {
    setNewName(event.target.value);
  };

  const newNumberChangeHandler = (event) => {
    setNewNumber(event.target.value);
  };

  const filterNameChangeHandler = (event) => {
    setFilterName(event.target.value);
  };

  const personsToShow = persons.filter(person => person.name.toLowerCase().startsWith(filterName.toLowerCase()));

  const buttonClickHandler = (event) => {
    event.preventDefault();
    if (persons.map(x => x.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      };
      setPersons(persons.concat(newPerson));
    }
    setNewName('');
    setNewNumber('');
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} filterNameChangeHandler={filterNameChangeHandler} />
      <h3>add a new</h3>
      <PersonForm newName={newName} newNameChangeHandler={newNameChangeHandler} newNumber={newNumber} newNumberChangeHandler={newNumberChangeHandler} buttonClickHandler={buttonClickHandler} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
