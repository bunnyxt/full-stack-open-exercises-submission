import React from 'react'

const Total = ({ course }) => 
  <p><b>total of {course.parts.reduce((acc, cur) => acc + cur.exercises, 0)} exercises</b></p>

export default Total
