import React from 'react';
import Header from './Header';
import Content from './Content';
import Total from './Total';

const Course = ({ course }) => 
  <div>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </div>

export default Course