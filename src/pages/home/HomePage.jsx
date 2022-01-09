import {Component, useState, useEffect} from 'react';
import './HomePage.css';
import axios from "axios";
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import * as imageApi from "../../services/ImageApi";
import {Row, Card, Carousel, Form, FormControl, Button, FormSelect, Tabs} from "react-bootstrap";
import {PATH} from "../../services/ConfigurationUrlAService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Typeahead} from 'react-bootstrap-typeahead';
import {Tab} from "bootstrap";
import {Navigate} from 'react-router-dom';
import Cookies from 'universal-cookie';
import EllipsisText from "react-ellipsis-text";

const cookies = new Cookies();

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
        this.buyBook = this.buyBook.bind(this);
        this.addToCart = this.addToCart.bind(this);

        this.state = {
            booksLoaded: false,
            bookChosen: false,
            bookChosenId: '',
            addToCartId: '',
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
            searchInput: '',
            buyBook: false,
            checkCart: false,
            buyBookId: '',
            wantToBuyBook: false
        }

        if(this.state.currentPageId == undefined){
            this.setState({
                currentPageId: 1
            })
        }

        this.fetchBooks();
    }

    async fetchBooks(){
        if(cookies.get('isLogged') == null){
            cookies.remove('token',  { path: '/' })
        }
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
                    for(let k = this.state.books.length - 1; k > this.state.books.length - 4; k--){
                        this.setState({
                            carouselBooks: this.state.carouselBooks.concat(this.state.books[k])
                        })
                    }
                }
            }, () => {
                console.log(this.state.pages)
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

    async buyBook(event){
        await cookies.remove('buyBook', { path: '/' });
        await cookies.set('buyBook', { "bookId": event.target.id, "quantity": 1 }, { path: '/' });
        if(cookies.get('token') == null){
            this.setState({
                wantToBuyBook: true
            })
        }
        else{
            await axios.post('/api/buyItem', {
                id: cookies.get('buyBook').bookId,
                quantity: cookies.get('buyBook').quantity,
                token: cookies.get('token')
            }, { params: {
                    buyBook: 'buyBook'
            }}).then(async resp =>{
                if(resp.status == 200){
                    await this.setState({
                        buyBookId: event.target.id,
                        buyBook: true
                    })
                }
            })
        }
    }

    async addToCart(event){
        await cookies.remove('addToCart', { path: '/' });
        await cookies.set('addToCart', { "bookId": event.target.id, "quantity": 1 }, { path: '/' });
        if(cookies.get('token') == null){
            this.setState({
                wantToBuyBook: true
            })
        }
        else{
            await axios.post('/api/buyItem', {
                id: cookies.get('addToCart').bookId,
                quantity: cookies.get('addToCart').quantity,
                token: cookies.get('token')
            }, { params: {
                    addToCart: 'addToCart'
            }}).then(async resp =>{
            if(resp.status == 200){
                await this.setState({
                    addToCartId: event.target.id,
                    checkCart: true
                })
            }
            })
        }
    }

    render() {
        const books = this.state.books.map((book) =>
            <Card style={{marginLeft: "4%", marginBottom: "40px", height: '600px', width: '400px', display: "inline-block"}} id={book.id}>
                <Card.Body>
                    <Card.Img style={{width: "200px", height: "300px", cursor: "pointer"}} variant="top" src={book.bookImage} id={book.id} onClick={this.handleBookClick} onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src=imageApi.getImageUrl("0");
                    }}/>
                    <Card.Title>
                        {book.title}
                    </Card.Title>
                    <Card.Subtitle>
                        {book.author}
                        <br/>
                        {book.publicationDate}
                        <br/>
                        {book.pageCount}
                    </Card.Subtitle>
                    <Card.Text>
                        <div>
                            <strong style={{color: 'red', display: 'inline-block'}}>{book.ourPrice}$</strong> <p style={{textDecoration: 'line-through', display: 'inline-block'}}>{book.listPrice}$</p>
                        </div>
                        <EllipsisText text={book.description} id={book.id} onClick={this.handleBookClick} length={"130"} />
                    </Card.Text>
                    <div hidden={book.inStockNumber > 0}>
                        <strong style={{color: 'red', display: 'inline-block'}}>No books in stock!</strong>
                    </div>
                    <div  hidden={book.inStockNumber <= 0}>
                        <i style={{cursor: 'pointer'}} id={book.id} className="fa fa-shopping-cart" onClick={this.addToCart}>&nbsp;Add to cart</i>
                        <br/>
                        <i style={{cursor: 'pointer'}} id={book.id} className="fa" onClick={this.buyBook}>&nbsp;Buy now</i>
                    </div>
                </Card.Body>
            </Card>
        )

        let carouselBooks;
        if(this.state.books.length > 3){
            carouselBooks = this.state.carouselBooks.map((book) =>
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
        }


        const pages = this.state.pages.map((page) =>
            <Tab style={{color: this.state.currentPageId == page ? "red" : "blue", textDecoration: "none", textAlign: "center"}} to={{ pathname: "/home#" + page}} eventKey={page} title={page} onClick={this.updatePage}></Tab>
        )

        if (this.state.buyBook) {
            return <Navigate to={{pathname: "/checkout#id#" + cookies.get('buyBook').bookId + '#quantity#' + cookies.get('buyBook').quantity}} />
        }

        if (this.state.checkCart) {
            return <Navigate to={{pathname: "/shopping#id#" + cookies.get('addToCart').bookId + '#quantity#' + cookies.get('addToCart').quantity}} />
        }

        if (this.state.bookChosen) {
            return <Navigate to={{pathname: "/books#" + this.state.bookChosenId}} />
        }

        if(this.state.wantToBuyBook) {
            return <Navigate to={{pathname: "/login"}} />
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