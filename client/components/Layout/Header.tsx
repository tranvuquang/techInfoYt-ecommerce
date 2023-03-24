import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { useRouter } from "next/router";
import { Navbar, Container, Nav, NavDropdown, Form } from "react-bootstrap";
import {
  selectProduct,
  setProductFilterRedux,
  setResetRedux,
} from "../../features/product/productSlice";
import { cartTransform } from "../../helpers/cart";

const Header = () => {
  const { route } = useRouter();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector(selectAuth);
  const { cart, productFilter, reset } = useAppSelector(selectProduct);
  const { role, name, id } = user;
  const [search, setSearch] = useState(productFilter.searchStr);
  const typingTimeoutRef = useRef(null);
  const { cartLength } = cartTransform(cart);
  const { push } = useRouter();

  useEffect(() => {
    if (productFilter.searchStr === "") {
      setSearch("");
    }
  }, [productFilter.searchStr]);

  const onSetSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setSearch(value);
    if (!dispatch) {
      return;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (route === "/") {
        dispatch(
          setProductFilterRedux({
            ...productFilter,
            homeSearch: value.toLowerCase(),
            searchStr: "",
          })
        );
      } else {
        dispatch(
          setProductFilterRedux({
            ...productFilter,
            searchStr: value.toLowerCase(),
            homeSearch: "",
          })
        );
        push("/");
      }
    }, 1000) as any;
  };

  const onFocus = () => {
    setSearch("");
    dispatch(setResetRedux(!reset));
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
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={search}
                onChange={onSetSearch}
                onFocus={onFocus}
              />
            </Form>
            <Nav.Link
              onClick={() => {
                push("/");
              }}
            >
              Home
            </Nav.Link>
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
