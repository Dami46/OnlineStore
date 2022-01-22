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
            await cookies.remove('buyBook', { path: '/' });
            await cookies.remove('buyBook', { path: '/' });
            await cookies.remove('addToCart', { path: '/' });
            await cookies.remove('checkout', { path: '/' });
            await cookies.remove('cartCheckout', { path: '/' });
            await cookies.remove('cartCheckoutSubmit', { path: '/' });
            await cookies.remove('dropToJoin', { path: '/' })
            await cookies.remove('captcha', { path: '/' })
        })
        .then(async () =>  {
            await cookies.set('isLogged', false, { path: '/' });
        })
    }

    render() {
        return (
            <Navbar fixed="top" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
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
                            {/*<Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/">Home</Nav.Link>*/}
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/">Books</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/drops">Drops</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/login" hidden={cookies.get('isLogged')}>Login</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/account" hidden={!cookies.get('isLogged')}>Account</Nav.Link>
                            <Nav.Link style={{fontSize: "30px", fontWeight: "bold"}} href="/shopping" hidden={!cookies.get('isLogged')}>Shopping Cart</Nav.Link>
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
