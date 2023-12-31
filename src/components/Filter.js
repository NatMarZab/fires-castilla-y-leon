import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useAPI } from '../services/apiContext';

export default function Filter({ data }) {
  const { selectedFilters, handleNewFilters } = useAPI();
  const filterName = Object.keys(data)[0]; 
  const valueSet = Object.values(data)[0];
  const filterNameForLabel = filterName[0].toUpperCase() + filterName.slice(1).replace(/_/g, " ");
  const storedFilterValue = selectedFilters[filterName];

  const handleChange = (event) => {
    const newFilters = { ...selectedFilters, [filterName]:  event.target.value};
    handleNewFilters(newFilters)
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{filterNameForLabel}</InputLabel> 
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={storedFilterValue}
          label={filterName}
          onChange={handleChange}
        >
           <MenuItem value="none" key="none">Ninguno</MenuItem>
           {valueSet.map((value) => (
            <MenuItem value={value} key={value} data-testId="selectOption">{value}</MenuItem>
           ))}
        </Select>
      </FormControl>
    </Box>
  );
}

