import React from "react";
import {
  Container,
  DropdownButton,
  Form,
  FormControl,
  Nav,
  Navbar,
  Dropdown,
} from "react-bootstrap";
function DropDownButton(props) {
  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={props.title}
      style={{ marginLeft: "10px" }}
      variant="outline-secondary"
    >
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>
  );
}

export default DropDownButton;
