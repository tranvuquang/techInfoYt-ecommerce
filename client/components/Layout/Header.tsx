import React from "react";

import { useAppSelector } from "../../app/hooks";
import {
  selectAuth,
} from "../../features/auth/authSlice";
import { useRouter } from "next/router";
import { Navbar, Container, Nav, NavDropdown, Form, Button } from "react-bootstrap";
import { selectProduct } from "../../features/product/productSlice";
import { cartTransform } from "../../helpers/cart";

const Header = () => {
  const { user, accessToken } = useAppSelector(selectAuth);
  const { cart } = useAppSelector(selectProduct);
  const { role, name, id } = user;
  const { cartLength } = cartTransform(cart);
  const { push } = useRouter();
  return (
    <Navbar bg="light" expand="sm" fixed="top">
      <Container fluid>
        <Navbar.Brand
          onClick={() => {
            push("/");
          }}
          style={{ cursor: "pointer" }}
        >
          🛒 Ecommerce App
        </Navbar.Brand>
        <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={() => {
                push("/");
              }}
            >
              Home
            </Nav.Link>
            <NavDropdown title="Categories" id="category">
              <NavDropdown.Item href="#action/3.1">Category 1</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Category 2</NavDropdown.Item>
            </NavDropdown>
            {!user || !accessToken ? (
              <Nav.Link onClick={() => push("/login")}>Login</Nav.Link>
            ) : (
              <NavDropdown title={name} id={id}>
                <NavDropdown.Item
                  onClick={() => {
                    push(`/dashboard/${role}`);
                  }}
                >
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => push("/logout")}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link
              onClick={() => {
                push("/cart");
              }}
            >
              Cart({cartLength})
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
