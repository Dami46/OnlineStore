import {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Logo = "/images/logo.png"

class NavbarTemplate extends Component {
    constructor() {
        super();
    }

    async logoutPressed(){
        await cookies.remove('isLogged',  { path: '/' })
        .then(async () =>  {
            await cookies.remove('token',  { path: '/' });
        })
        .then(async () =>  {
            await cookies.set('isLogged', false, { path: '/' });
        })
    }

    render() {
        console.log(cookies.get('isLogged'))

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
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/login" hidden={cookies.get('isLogged')}>Login</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/account" hidden={!cookies.get('isLogged')}>Account</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/shopping">Shopping Cart</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/balance" hidden={!cookies.get('isLogged')}>Balance</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/home" hidden={!cookies.get('isLogged')} onClick={this.logoutPressed}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export {NavbarTemplate};
