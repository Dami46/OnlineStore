import {Component} from 'react';
import './HomePage.css';
// import {Navbar} from '../../navbar/Navbar.jsx';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Carousel from "react-bootstrap/Carousel";

var Logo = "/images/logo.png"
var Book1 = "/images/book1_example.jpg"
var Book2 = "/images/book2_example.jpg"
var Book3 = "/images/book3_example.jpg"
var Book1_slide = "/images/book1_example_slide.jpg"
var Book2_slide = "/images/book2_example_slide.jpg"
var Book3_slide = "/images/book3_example_slide.jpg"


class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
              <div>
                  <Navbar fixed="top" bg="light" variant="light">
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
                  <br/>
              </div>

              <div>
                  <Carousel>
                      <Carousel.Item>
                          <img
                              className="d-block w-100"
                              src={Book1_slide}
                              width="100"
                              height="200"
                              alt="First book"
                          />
                          <Carousel.Caption>
                              <h3>First book label</h3>
                              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                          </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                          <img
                              className="d-block w-100"
                              src={Book2_slide}
                              width="100"
                              height="200"
                              alt="Second book"
                          />

                          <Carousel.Caption>
                              <h3>Second book label</h3>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                          <img
                              className="d-block w-100"
                              src={Book3_slide}
                              width="100"
                              height="200"
                              alt="Third book"
                          />

                          <Carousel.Caption>
                              <h3>Third book label</h3>
                              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                          </Carousel.Caption>
                      </Carousel.Item>
                  </Carousel>
              </div>

              <div>
                  <br/>
              </div>

              <div style={{height: "600px", textAlign: "center"}}>
                  <img style={{height: "600px"}} src={Book1}/>
                  <img style={{height: "600px", marginLeft: "50px"}} src={Book2}/>
                  <img style={{height: "600px", marginLeft: "50px"}} src={Book3}/>
              </div>

              <div>
                  <br/>
              </div>

              <div style={{height: "600px", textAlign: "center"}}>
                  <img style={{height: "600px"}} src={Book2}/>
                  <img style={{height: "600px", marginLeft: "50px"}} src={Book1}/>
                  <img style={{height: "600px", marginLeft: "50px"}} src={Book3}/>
              </div>

              <div>
                  <br/>
              </div>

              <div style={{height: "600px", textAlign: "center"}}>
                  <img style={{height: "600px"}} src={Book3}/>
                  <img style={{height: "600px", marginLeft: "50px"}} src={Book2}/>
                  <img style={{height: "600px", marginLeft: "50px"}} src={Book1}/>
              </div>
          </div>
        );
    }
}

export {HomePage};
