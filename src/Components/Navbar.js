import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import "./Navbar.css";

const NavbarComponent = ({ onAddTaskClick, onLogout }) => {
  return (
    <Container>
      <Navbar expand="lg" className="mb-5">
        <Navbar.Brand href="#home">Tasks</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto ms-auto">
            <Button
              variant="primary"
              onClick={onAddTaskClick}
              style={{ marginRight: "20px" }}
              className="task-btn"
            >
              Add Task
            </Button>
            <Button variant="secondary" onClick={onLogout} className="task-btn">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default NavbarComponent;
