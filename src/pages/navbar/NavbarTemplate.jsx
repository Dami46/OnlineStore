import {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Globals from "../../Globals";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Logo = "/images/logo.png"

// let isLogged = cookies.get('isLogged')
let isLogged = false

function logoutPressed(){
    // Globals.isUserLogged = false;
    cookies.remove('isLogged');
    cookies.set('isLogged', 'false', { path: '/' });
    console.log(isLogged)
    isLogged = cookies.get('isLogged')
}

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
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/">Home</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/books">Books</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/drops">Drops</Nav.Link>
                        </Nav>
                        <Nav>
                            {/*<Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/login" hidden={Globals.isUserLogged}>Login</Nav.Link>*/}
                            {/*<Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/account" hidden={!Globals.isUserLogged}>Account</Nav.Link>*/}
                            {/*<Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/shopping">Shopping Cart</Nav.Link>*/}
                            {/*<Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/balance" hidden={!Globals.isUserLogged}>Balance</Nav.Link>*/}
                            {/*<Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/home" hidden={!Globals.isUserLogged} onClick={logoutPressed}>Logout</Nav.Link>*/}
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/login" hidden={isLogged}>Login</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/account" hidden={!isLogged}>Account</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/shopping">Shopping Cart</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/balance" hidden={!isLogged}>Balance</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/home" hidden={!isLogged} onClick={logoutPressed}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export {NavbarTemplate};
