import React from 'react'

const Filter = ({ filterName, filterNameChangeHandler }) =>
  <div>
    filter shown with <input value={filterName} onChange={filterNameChangeHandler} />
  </div>

export default Filter
