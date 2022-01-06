import {Component, useState, useEffect} from 'react';
import './HomePage.css';
import axios from "axios";
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import * as imageApi from "../../services/ImageApi";
import {Row, Card, Carousel, Form, FormControl, Button, FormSelect, Tabs} from "react-bootstrap";
import {PATH} from "../../services/ConfigurationUrlAService";
import {Link, Navigate} from "react-router-dom";
import {Typeahead} from 'react-bootstrap-typeahead';
import {Tab} from "bootstrap";

const Book1_slide = "/images/book1_example_slide.jpg"
const Book2_slide = "/images/book2_example_slide.jpg"
const Book3_slide = "/images/book3_example_slide.jpg"

const URLAddress = PATH;

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.handleBookClick = this.handleBookClick.bind(this);
        this.filterBooksClick = this.filterBooksClick.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.searchOptionClick = this.searchOptionClick.bind(this);
        this.updatePage = this.updatePage.bind(this);

        this.state = {
            booksLoaded: false,
            bookChosen: false,
            bookChosenId: '',
            currentPageId: window.location.href.split('#')[1],
            pageCount: 0,
            pages: [],
            books: [],
            carouselBooks: [],
            titles: [],
            authors: [],
            categorys: [],
            languages: [],
            publishers: [],
            filterOption: 'titles',
            options: [],
            searchInput: ''
        }

        if(this.state.currentPageId == undefined){
            this.setState({
                currentPageId: 1
            })
        }

        this.fetchBooks();
    }

    async fetchBooks(){
        if(this.state.booksLoaded == false) {
            this.setState({
                bookChosen: false,
                bookChosenId: '',
                books: [],
                carouselBooks: [],
                titles: [],
                authors: [],
                categorys: [],
                languages: [],
                publishers: [],
                nextPageChosen: false,
                nextPageId: 0,
                currentPageId: 1,
                pageCount: 0,
                pages: [],
            })
            await axios.get(URLAddress + '/api/bookshelf').then(booksResp => {
                return booksResp.data.bookList;
            }).then(data => {
                if(this.state.books.length == 0) {
                    for(let j = 0; j < data.length; j++){
                        if(j % 20 == 0){
                            this.setState({
                                pageCount: this.state.pageCount + 1,
                                pages: this.state.pages.concat(this.state.pageCount + 1),
                            })
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        let imageUrl = imageApi.getImageUrl(data[i].id)
                        this.setState({
                            books: this.state.books.concat({
                                id: data[i].id,
                                author: data[i].author,
                                bookImage: imageUrl,
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
                                name: data[i].author,
                            }),
                            categorys: this.state.categorys.concat({
                                name: data[i].category,
                            }),
                            languages: this.state.languages.concat({
                                name: data[i].language,
                            }),
                            publishers: this.state.publishers.concat({
                                name: data[i].publisher,
                            }),
                            titles: this.state.titles.concat({
                                name: data[i].title,
                            }),
                        })
                    }
                    for(let k = 0; k < 3; k++){
                        this.setState({
                            carouselBooks: this.state.carouselBooks.concat(this.state.books[k])
                        })
                    }
                }
            }, () => {
                console.log(this.state.pages)
                console.log(this.state.carouselBooks)
            })
        }
    }

    handleBookClick(event){
        let id = event.currentTarget.id
        this.setState({
            bookChosen: true,
            bookChosenId: id
        }, () => {
            console.log(this.state.bookChosenId)
        })
    }

    filterBooksClick(){
        this.fetchBooks().then(() => {
            let filteredBooks = [];
            filteredBooks = this.state.books.filter((book) => book[this.state.filterOption].toLowerCase().includes(this.state.searchInput.toLowerCase()))
            this.setState({
                books: filteredBooks
            })
        })
    }

    handleFilterChange(event){
        this.setState({
            filterOption: event.target.value,
            options: this.state[event.target.value + "s"]
        }, () => {
            console.log(this.state.filterOption)
            console.log(this.state.options)
        })
    }

    handleSearchInputChange(event){
        this.setState({
            searchInput: event.target.value
        }, () => {
            console.log(this.state.searchInput)
        })

    }

    searchOptionClick(event){
        try {
            this.setState({
                searchInput: event[0].name
            }, () => {
                console.log(this.state.searchInput)
            })
        }
        catch(err) {}
    }

    updatePage(key){
        console.log(key)
            this.fetchBooks().then(() => {
                let filteredBooks = [];
                let fin = key * 20;
                if(this.state.books.length < fin){
                    fin = this.state.books.length;
                }
                for(let i = (key - 1) * 20; i < fin; i++){
                    console.log(i);
                    filteredBooks.push(this.state.books[i]);
                }
                this.setState({
                    books: filteredBooks
                })
            })
    }

    render() {
        const books = this.state.books.map((book) =>
            <Card style={{marginLeft: "4%", marginBottom: "40px", display: "inline-block", cursor: "pointer"}} id={book.id} onClick={this.handleBookClick}>
                <Card.Body>
                    <Card.Img width="200" height="300" variant="top" src={book.bookImage} onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src=imageApi.getImageUrl("0");
                    }}/>
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

        const carouselBooks = this.state.carouselBooks.map((book) =>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={book.bookImage}
                    width="100"
                    height="200"
                    alt="First book"
                />
                <Carousel.Caption>
                    <h3>{book.title}</h3>
                    <p>{book.description}</p>
                </Carousel.Caption>
            </Carousel.Item>
        )

        const pages = this.state.pages.map((page) =>
            <Tab style={{color: this.state.currentPageId == page ? "red" : "blue", textDecoration: "none", textAlign: "center"}} to={{ pathname: "/home#" + page}} eventKey={page} title={page} onClick={this.updatePage}></Tab>
        )

        if (this.state.bookChosen) {
            return <Navigate to={{pathname: "/books#" + this.state.bookChosenId}} />
        }

        return (
          <div>
              <div>
                  <NavbarTemplate/>
                  <br/>
              </div>

              <div>
                  <div>
                      <Carousel>
                          {carouselBooks}
                      </Carousel>
                  </div>

                  <div>
                      <br/>
                  </div>

                  <div style={{marginLeft: "20%", width: "60%"}}>
                      <Form className="d-flex">
                          <Form.Select style={{ width: "20%"}} onChange={this.handleFilterChange}>
                              <option value="title">Title</option>
                              <option value="author">Author</option>
                              <option value="category">Category</option>
                              <option value="language">Language</option>
                              <option value="publisher">Publisher</option>
                          </Form.Select>
                          <Typeahead
                              style={{width: "70%"}}
                              id="basic-typeahead-single"
                              labelKey="name"
                              className="me-2"
                              onChange={this.searchOptionClick}
                              options={this.state.options}
                              placeholder="Search"
                          />
                          <Button variant="primary" onClick={this.filterBooksClick}>Search</Button>
                      </Form>
                      <br/>
                  </div>

                  <Tabs style={{alignItems: "center", justifyContent: "center"}} defaultActiveKey="1" className="mb-3" onSelect={this.updatePage}>
                      {pages}
                  </Tabs>

                  <div style={{height: "300px", marginTop: "50px"}}>
                      <Row style={{textAlign: "center", alignItems: "center"}} xs={5}>
                          {books}
                      </Row>
                  </div>
              </div>
          </div>
        );
    }
}

export {HomePage};
