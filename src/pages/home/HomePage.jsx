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
import {Footer} from "../contact/Footer";

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
        this.sortAsc = this.sortAsc.bind(this);
        this.sortDsc = this.sortDsc.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.sortBooks = this.sortBooks.bind(this);

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
            wantToBuyBook: false,
            sortingOption: 'title'
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
        catch(err) {

        }
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

    sortAsc(){
        let sortedBooks;
        sortedBooks = this.state.books.sort((a,b)=>{
            console.log(b[this.state.sortingOption])
            console.log(a[this.state.sortingOption])
            return a[this.state.sortingOption]  - b[this.state.sortingOption];
        })
        this.setState({
            books: sortedBooks
        })
        console.log(this.state.books)
    }


    sortDsc(){
        let sortedBooks;
        console.log(this.state.sortingOption)
        console.log(this.state)
        console.log(this.state.books[this.state.sortingOption])
        sortedBooks = this.state.books.sort((a,b)=>{
            console.log(b[this.state.sortingOption])
            console.log(a[this.state.sortingOption])
            return b[this.state.sortingOption] - a[this.state.sortingOption];
        })
        this.setState({
            books: sortedBooks
        })
        console.log(this.state.books)
    }

    handleSortChange(event){
        this.setState({
            sortingOption: event.target.value
        })
    }

    sortBooks(event){
        if(event.target.value == 'asc'){
            this.sortAsc()
        }
        else{
            this.sortDsc()
        }
    }

    render() {
        const books = this.state.books.map((book) =>
            <Card style={{marginLeft: "5%", marginBottom: "40px", height: '500px', width: '20%', display: "inline-block", color: "white", backgroundColor: "#4c4c4c"}} id={book.id}>
                <Card.Body>
                    <Card.Img style={{width: "60%", height: "300px", cursor: "pointer"}} variant="top" src={book.bookImage} id={book.id} onClick={this.handleBookClick} onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src=imageApi.getImageUrl("0");
                    }}/>
                    <Card.Title style={{color: "#4cbde9"}}>
                        {book.title}
                    </Card.Title>
                    <Card.Subtitle style={{color: "#4cbde9"}}>
                        {book.author}
                        <br/>
                        {book.publicationDate}
                        <br/>
                        {book.pageCount}
                    </Card.Subtitle>
                    <Card.Text style={{color: "#4cbde9"}}>
                        <div>
                            <strong style={{textDecoration: 'line-through', color: "#f2575b", display: 'inline-block'}}>${book.listPrice}</strong> <p style={{display: 'inline-block'}}>${book.ourPrice}</p>
                        </div>
                        {/*<EllipsisText style={{cursor: "pointer"}} text={book.description} id={book.id} onClick={this.handleBookClick} length={"130"} />*/}
                    </Card.Text>
                    <div hidden={book.inStockNumber > 0}>
                        <strong style={{color: "#f2575b", display: 'inline-block'}}>No books in stock!</strong>
                    </div>
                    <div  hidden={book.inStockNumber <= 0} style={{color: "#4cbde9"}}>
                        <i style={{cursor: 'pointer'}} id={book.id} className="fa fa-shopping-cart" onClick={this.addToCart}>&nbsp;Add to cart</i>
                        <br/>
                        <i style={{cursor: 'pointer'}} id={book.id} className="fa" onClick={this.buyBook}>&nbsp;Buy now</i>
                    </div>
                </Card.Body>
            </Card>
        )

        let carouselBooks;
        if(this.state.books.length > 0){
            try{
                carouselBooks = this.state.carouselBooks.map((book) =>
                    <Carousel.Item id={book.id} onClick={this.handleBookClick} style={{height: "300px", cursor: "pointer"}}>
                        <img
                            className="d-block w-100"
                            src={book.bookImage}
                            alt="First book"
                            style={{display: "inline-block"}}
                        />
                        <Carousel.Caption>
                            <h3>{book.title}</h3>
                            <p>{book.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                )
            }
            catch (err) {}
        }


        const pages = this.state.pages.map((page) =>
            <Tab variant="dark" style={{backgroundColor: "#212121"}} to={{ pathname: "/home#" + page}} eventKey={page} title={page} onClick={this.updatePage}></Tab>
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
          <div style={{backgroundColor: "#212121", height: '100vh', minHeight: '100vh'}}>
              <div>
                  <NavbarTemplate/>
                  <br/>
              </div>

              <div style={{backgroundColor: "#212121"}}>
                  <div>
                      <Carousel style={{height: "300px"}}>
                          {carouselBooks}
                      </Carousel>
                  </div>

                  <div>
                      <br/>
                  </div>

                  <div style={{marginLeft: "20%", width: "60%"}}>
                      <Form className="d-flex">
                          <Form.Select style={{ width: "20%", backgroundColor: "#4c4c4c", color: "#4cbde9"}} variant="info" onChange={this.handleFilterChange}>
                              <option value="title">Title</option>
                              <option value="author">Author</option>
                              <option value="category">Category</option>
                              <option value="language">Language</option>
                              <option value="publisher">Publisher</option>
                          </Form.Select>
                          <Typeahead
                              style={{width: "70%", marginLeft: "2%"}}
                              id="basic-typeahead-single"
                              labelKey="name"
                              onChange={this.searchOptionClick}
                              options={this.state.options}
                              placeholder="Search"
                          />
                          <Button style={{marginLeft: "1%", backgroundColor: "#4c4c4c", color: "#4cbde9"}} variant="light" onClick={this.filterBooksClick}>Search</Button>
                      </Form>
                      <br/>
                  </div>

                  {/*<div style={{marginLeft: "20%", width: "60%"}}>*/}
                  {/*    <Form className="d-flex">*/}
                  {/*        <Form.Select style={{ width: "20%", backgroundColor: "#4c4c4c", color: "#4cbde9"}} variant="info" onChange={this.handleSortChange}>*/}
                  {/*            <option value="title">Title</option>*/}
                  {/*            <option value="author">Author</option>*/}
                  {/*            <option value="category">Category</option>*/}
                  {/*            <option value="language">Language</option>*/}
                  {/*            <option value="publisher">Publisher</option>*/}
                  {/*        </Form.Select>*/}
                  {/*        <Form.Select style={{ width: "20%", backgroundColor: "#4c4c4c", color: "#4cbde9"}} variant="info" onChange={this.sortBooks}>*/}
                  {/*            <option value="asc">Ascending</option>*/}
                  {/*            <option value="dsc">Descending</option>*/}
                  {/*        </Form.Select>*/}
                  {/*    </Form>*/}
                  {/*    <br/>*/}
                  {/*</div>*/}

                  <Tabs style={{alignItems: "center", justifyContent: "center", backgroundColor: "#212121", color: "#4cbde9"}} defaultActiveKey="1" className="mb-3" onSelect={this.updatePage}>
                      {pages}
                  </Tabs>

                  <div style={{height: "300px", marginTop: "50px", backgroundColor: "#212121"}}>
                      <Row style={{textAlign: "center", alignItems: "center", backgroundColor: "#212121"}} xs={5}>
                          {books}
                      </Row>
                      <Footer/>
                  </div>
              </div>
          </div>
        );
    }
}

export {HomePage};
