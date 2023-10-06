import { useState } from 'react';
//import CourseList from './CourseList';
// In TermButton.jsx, TermSelector.jsx, or any other component using `terms`
//import { terms } from '../utilities/constants';  // Adjust the path based on your folder structure
//import TermButton from './TermButton';

const EventFilter = ({selection, setSelection}) => (
    <div className="btn-group">
        <TermButton term="All" selection={selection} setSelection={setSelection} />
      { 
        terms.map(term => <TermButton key={term} term={term} selection={selection} setSelection={setSelection} />)
      }
    </div>
  );

export default EventFilter;