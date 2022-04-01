import React from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
function DropDownButton(props) {
  return (
    <Box sx={{ minWidth: 150 }} style={{ float: "left", marginLeft: "10px", }}>
      <FormControl fullWidth size="small" >
        <InputLabel id="demo-simple-select-label" style={{ fontSize: "0.6vw", marginTop: "5px" }}>{props.title}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label={props.title}

        >
          <MenuItem value={10}>Latency</MenuItem>
          <MenuItem value={20}>Coverage</MenuItem>
          <MenuItem value={30}>5G Availability</MenuItem>
        </Select>
      </FormControl>
    </Box >
  );
}

export default DropDownButton;
