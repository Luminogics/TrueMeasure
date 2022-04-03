import React, { useState } from "react";
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
function Header({ clickHandler ,setThroughPutValue}) {
  const [searchCord, setSearchCord] = useState();
  const submitHandler = (e) => {
    e.preventDefault();
  }

  const setValue = (val) =>{
   
    setThroughPutValue(val)
  }
  return (
    <Navbar expand="lg" style={{ color: "white", boxShadow: "5px 10px 18px #888888" }}>
      <Container fluid>
        <Navbar.Brand href="#">True Measure</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 m-5"
            style={{ maxHeight: "200px", marginLeft: "12px" }}
            navbarScroll
          >
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                style={{ width: "300px" }}
                aria-label="Search"
                onSubmit={submitHandler}
                onChange={(e) => setSearchCord(e.target.value)}
              />
              <Button onClick={() => clickHandler(searchCord)}>
                <BsSearch /> Search
              </Button>
            </Form>
            <div style={{ float: "left" }}>
              <DropDownButton title="Single Service Provider"  setValue={setValue}/>
              <DropDownButton title="Throughput" setValue={setValue} />
              <DropDownButton title="ATI" setValue={setValue}/>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default Header;
