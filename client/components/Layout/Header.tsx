import React from "react";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import toast from "react-hot-toast";
import { Badge } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAuth,
  setAccessTokenRedux,
  setUserRedux,
} from "../../features/auth/authSlice";
import { Role, userDefaultData } from "../../features/auth/types";
import axios from "axios";
import { useRouter } from "next/router";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

const Header = () => {
  const { user, accessToken } = useAppSelector(selectAuth);
  const { role, name,id } = user;
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    const res = await axios.post("/api/logout");
    if (res.data.status === 200) {
      dispatch(setAccessTokenRedux(""));
      dispatch(setUserRedux(userDefaultData));
      deleteCookie("accessToken");
      push("/login");
    }
    toast.success("Logout Successfully");
  };
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
                <NavDropdown.Item href="#action/3.2" onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link href="#link">Cart(0)</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
