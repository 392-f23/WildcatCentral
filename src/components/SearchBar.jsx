import React from 'react';
import InputBase from '@mui/material/InputBase';

const SearchBar = ({ handleSearch, sx }) => {
  const handleChange = (e) => {
    handleSearch(e.target.value);
  };

  return (
    <InputBase 
      type="text" 
      placeholder="Search..." 
      onChange={handleChange} 
      sx={{ ...sx, backgroundColor: 'white' }}
    />
  );
};

export default SearchBar;
