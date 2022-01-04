import {Component, useState, useEffect} from 'react';
import './HomePage.css';
import axios from "axios";
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import * as imageApi from "../../services/ImageApi";
import {Row, Card, Carousel, Form, FormControl, Button, FormSelect} from "react-bootstrap";
import {PATH} from "../../services/ConfigurationUrlAService";

const Logo = "/images/logo.png"
const Book1 = "/images/book1_example.jpg"
const Book2 = "/images/book2_example.jpg"
const Book3 = "/images/book3_example.jpg"
const Book1_slide = "/images/book1_example_slide.jpg"
const Book2_slide = "/images/book2_example_slide.jpg"
const Book3_slide = "/images/book3_example_slide.jpg"

const URLAddress = PATH;

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            booksLoaded: false,
            books: [],
            authors: [],
            categories: [],
            languages: [],
            publishers: []
        }
    }

    async fetchBooks(){
        console.log(URLAddress + '/api/bookshelf')
        if(this.state.booksLoaded == false) {
            this.setState({
                booksLoaded: true,
                books: [],
                authors: [],
                categories: [],
                languages: [],
                publishers: []
            })
            await axios.get(URLAddress + '/api/bookshelf').then(booksResp => {
                return booksResp.data.bookList;
            }).then(data => {
                console.log(data)
                if(this.state.books.length == 0) {
                    for (let i = 0; i < data.length; i++) {
                        console.log(data[i])
                        this.setState({
                            books: this.state.books.concat({
                                id: data[i].id,
                                author: data[i].author,
                                bookImage: imageApi.getImageUrl(data[i].id),
                                category: data[i].category,
                                description: data[i].description,
                                inStockNumber: data[i].inStockNumber,
                                language: data[i].language,
                                listPrice: data[i].listPrice,
                                numberOfPages: data[i].numberOfPages,
                                ourPrice: data[i].ourPrice,
                                publicationDate: data[i].publicationDate,
                                publisher: data[i].publisher,
                                title: data[i].title,
                            }),
                            authors: this.state.authors.concat({
                                author: data[i].author,
                            }),
                            categories: this.state.categories.concat({
                                category: data[i].category,
                            }),
                            languages: this.state.languages.concat({
                                language: data[i].language,
                            }),
                            publishers: this.state.publishers.concat({
                                publisher: data[i].publisher,
                            }),
                        })
                    }
                    console.log(this.state.books)
                }
            });
        }
    }

    render() {
        this.fetchBooks()
        const books = this.state.books.map((book) =>
            <Card style={{marginLeft: "4%", marginBottom: "40px", display: "inline-block", cursor: "pointer"}}>
                <Card.Body>
                    <Card.Img width="200" height="300" variant="top" src={book.bookImage}/>
                    <Card.Title>
                        {book.title}
                    </Card.Title>
                    <Card.Subtitle>
                        {book.author}
                    </Card.Subtitle>
                    <Card.Text>
                        {book.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        )

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

              <div style={{marginLeft: "20%", width: "60%"}}>
                  <Form className="d-flex">
                      <Form.Select style={{ width: "20%"}}>
                          <option>Title</option>
                          <option>Author</option>
                          <option>Category</option>
                          <option>Language</option>
                          <option>Publisher</option>
                      </Form.Select>
                      <FormControl
                          type="search"
                          placeholder="Search"
                          className="me-2"
                          aria-label="Search"
                      />
                      <Button variant="primary">Search</Button>
                  </Form>
              </div>

              <div style={{height: "300px", marginTop: "50px"}}>
                  <Row style={{textAlign: "center", alignItems: "center"}} xs={5}>
                      {books}
                  </Row>
              </div>
          </div>
        );
    }
}

export {HomePage};
