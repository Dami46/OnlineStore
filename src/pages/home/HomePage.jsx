import {Component, useState, useEffect} from 'react';
import './HomePage.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import App from "../../App";
import {NavbarTemplate} from "../navbar/NavbarTemplate";

var Logo = "/images/logo.png"
var Book1 = "/images/book1_example.jpg"
var Book2 = "/images/book2_example.jpg"
var Book3 = "/images/book3_example.jpg"
var Book1_slide = "/images/book1_example_slide.jpg"
var Book2_slide = "/images/book2_example_slide.jpg"
var Book3_slide = "/images/book3_example_slide.jpg"

const URLAddress = 'http://localhost:3000';

class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    async fetchBooks(){
        console.log(URLAddress + '/api/bookshelf')
        await axios.get(URLAddress + '/api/bookshelf').then(booksResp => {
            console.log(booksResp.data)
        });
    }

    render() {
        this.fetchBooks()
        return (
          <div>
              <div>
                  <NavbarTemplate/>
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
