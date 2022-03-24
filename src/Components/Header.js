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

import Button from "react-bootstrap/Button";
import { BsSearch } from "react-icons/bs";
import DropDownButton from "./DropDownButton";
function Header() {
  return (
    <Navbar expand="lg" style={{ color: "white" }}>
      <Container fluid>
        <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 m-5"
            style={{ maxHeight: "800px", margin: "12px" }}
            navbarScroll
          >
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                style={{ width: "300px" }}
                aria-label="Search"
              />
              <Button>
                <BsSearch /> Search
              </Button>
            </Form>
            <DropDownButton title="Single Service Provider" />
            <DropDownButton title="Throughput" />
            <DropDownButton title="ATI" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
