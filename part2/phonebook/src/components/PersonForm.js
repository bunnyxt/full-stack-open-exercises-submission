import React from 'react'

const PersonForm = ({ newName, newNameChangeHandler, newNumber, newNumberChangeHandler, buttonClickHandler}) =>
  <form>
    <div>
      name: <input value={newName} onChange={newNameChangeHandler} />
    </div>
    <div>
      number: <input value={newNumber} onChange={newNumberChangeHandler} />
    </div>
    <div>
      <button type="submit" onClick={buttonClickHandler}>add</button>
    </div>
  </form>

export default PersonForm
