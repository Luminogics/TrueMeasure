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
      <Dropdown.Item href="#/action-1">Latency</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Coverage</Dropdown.Item>
      <Dropdown.Item href="#/action-3">5G Availability</Dropdown.Item>
    </DropdownButton>
  );
}

export default DropDownButton;
