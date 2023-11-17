// SearchBar.jsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ handleSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const onSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const onSearchSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <form onSubmit={onSearchSubmit} className={className}>
      <TextField
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={onSearchChange}
      />
      <IconButton type="submit">
        <SearchIcon />
      </IconButton>
    </form>
  );
};

export default SearchBar;
