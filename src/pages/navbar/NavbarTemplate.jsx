import {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";

const Logo = "/images/logo.png"

class NavbarTemplate extends Component {
    render() {
        return (
            <Navbar fixed="top" bg="white" variant="light">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            src={Logo}
                            width="140"
                            height="70"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link style={{fontSize: "35px", fontWeight: "bold"}} href="/">Home</Nav.Link>
                            <Nav.Link style={{fontSize: "35px", fontWeight: "bold"}} href="/books">Books</Nav.Link>
                            <Nav.Link style={{fontSize: "35px", fontWeight: "bold"}} href="/drops">Drops</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link style={{fontSize: "35px", fontWeight: "bold"}} href="/account">Account</Nav.Link>
                            <Nav.Link style={{fontSize: "35px", fontWeight: "bold"}} href="/shopping">Shopping Cart</Nav.Link>
                            <Nav.Link style={{fontSize: "35px", fontWeight: "bold"}} href="/contact">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export {NavbarTemplate};
