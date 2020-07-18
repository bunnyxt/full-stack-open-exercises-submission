import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Message from './components/Message'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [messageText, setMessageText] = useState(null);
  const [messageType, setMessageType] = useState('success');

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
    let newPerson = persons.find(person => person.name === newName);
    if (newPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        newPerson.number = newNumber;
        personService
          .update(newPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== newPerson.id ? person : returnedPerson));
            setMessageType('success');
            setMessageText(`Successfully update ${newPerson.name}!`);
            setTimeout(() => {
              setMessageText(null);
            }, 2000)
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setMessageType('error');
            setMessageText(`Fail to update ${newPerson.name}! ${error}`);
            setTimeout(() => {
              setMessageText(null);
            }, 2000)
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      };
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setMessageType('success');
          setMessageText(`Successfully add ${returnedPerson.name}!`);
          setTimeout(() => {
            setMessageText(null);
          }, 2000)
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setMessageType('error');
          setMessageText(`Fail to add ${newPerson.name}! ${error}`);
          setTimeout(() => {
            setMessageText(null);
          }, 2000)
        })
    }
  };

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const deleteButtonClickHandler = (event) => {
    event.preventDefault();
    const personName = event.target.name;
    const personId = event.target.id;
    if (window.confirm(`Delete ${personName} ?`)) {
      personService
        .remove(event.target.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== personId));
          setMessageType('success');
          setMessageText(`Successfully delete ${personName}!`);
          setTimeout(() => {
            setMessageText(null);
          }, 2000)
        })
        .catch(error => {
          setMessageType('error');
          setMessageText(`Fail to delete ${personName}! ${error}`);
          setTimeout(() => {
            setMessageText(null);
          }, 2000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message text={messageText} type={messageType} />
      <Filter filterName={filterName} filterNameChangeHandler={filterNameChangeHandler} />
      <h3>add a new</h3>
      <PersonForm newName={newName} newNameChangeHandler={newNameChangeHandler} newNumber={newNumber} newNumberChangeHandler={newNumberChangeHandler} buttonClickHandler={buttonClickHandler} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deleteButtonClickHandler={deleteButtonClickHandler} />
    </div>
  )
}

export default App
