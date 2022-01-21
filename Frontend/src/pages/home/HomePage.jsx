import {Component, useState, useEffect} from 'react';
import './HomePage.css';
import axios from "axios";
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import * as imageApi from "../../services/ImageApi";
import {Row, Card, Carousel, Form, FormControl, Button, FormSelect, Tabs} from "react-bootstrap";
import {PATH} from "../../services/ConfigurationUrlAService";
import {Typeahead} from 'react-bootstrap-typeahead';
import {Tab} from "bootstrap";
import {Navigate} from 'react-router-dom';
import Cookies from 'universal-cookie';
import EllipsisText from "react-ellipsis-text";
import {Footer} from "../contact/Footer";
import {LoadingScreen} from "../../services/LoadingScreen";

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
            publicationDates: [],
            prices: [],
            filterOption: 'titles',
            options: [],
            searchInput: '',
            buyBook: false,
            checkCart: false,
            buyBookId: '',
            wantToBuyBook: false,
            sortingOption: 'title',
            insufficientBalance: false,
            isLoading: true,
        }

        if(this.state.currentPageId == undefined){
            this.setState({
                currentPageId: 1
            })
        }

        this.fetchBooks();
    }

    async fetchBooks(){
        this.setState({
            isLoading: true,
        })
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
                publicationDates: [],
                prices: [],
                nextPageChosen: false,
                nextPageId: 0,
                currentPageId: 1,
                pageCount: 0,
                pages: [],
            })
            await axios.get(URLAddress + '/api/bookshelf').then(booksResp => {
                return booksResp.data.bookList;
            }).then(async data => {
                if(this.state.books.length == 0) {
                    for(let j = 0; j < data.length; j++){
                        if(j % 20 == 0){
                            await this.setState({
                                pageCount: this.state.pageCount + 1,
                                pages: this.state.pages.concat(this.state.pageCount + 1),
                            })
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        let imageUrl = imageApi.getImageUrl(data[i].id)
                        await this.setState({
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
                        })
                        try{
                            if(!this.state.authors.includes(data[i].author.toLowerCase())){
                                await this.setState({
                                    authors: this.state.authors.concat({
                                        name: data[i].author,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.categorys.includes(data[i].category.toLowerCase())){
                                await this.setState({
                                    categorys: this.state.categorys.concat({
                                        name: data[i].category,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.languages.includes(data[i].language.toLowerCase())){
                                await this.setState({
                                    languages: this.state.languages.concat({
                                        name: data[i].language,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.publishers.includes(data[i].publisher.toLowerCase())){
                                await this.setState({
                                    publishers: this.state.publishers.concat({
                                        name: data[i].publisher,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.titles.includes(data[i].title.toLowerCase())){
                                await this.setState({
                                    titles: this.state.titles.concat({
                                        name: data[i].title,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.titles.includes(data[i].title.toLowerCase())){
                                await this.setState({
                                    titles: this.state.titles.concat({
                                        name: data[i].title,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.publicationDates.includes(data[i].publicationDate.toLowerCase())){
                                await this.setState({
                                    publications: this.state.publicationDates.concat({
                                        name: data[i].publicationDate,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.prices.includes(data[i].ourPrice)){
                                await this.setState({
                                    prices: this.state.prices.concat({
                                        name: data[i].ourPrice,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                    }
                    try{
                        await this.setState({
                            authors: this.state.authors.filter((author, index) => index === this.state.authors.findIndex(element => element.name === author.name))
                        })
                    }
                    catch(err) {}
                    try{
                        await this.setState({
                            categorys: this.state.categorys.filter((category, index) => index === this.state.categorys.findIndex(element => element.name === category.name))
                        })
                    }
                    catch(err) {}
                    try{
                        await this.setState({
                            languages: this.state.languages.filter((language, index) => index === this.state.languages.findIndex(element => element.name === language.name))
                        })
                    }
                    catch(err) {}
                    try{
                        await this.setState({
                            publishers: this.state.publishers.filter((publisher, index) => index === this.state.publishers.findIndex(element => element.name === publisher.name))
                        })
                    }
                    catch(err) {}
                    try{
                        await this.setState({
                            titles: this.state.titles.filter((title, index) => index === this.state.titles.findIndex(element => element.name === title.name))
                        })
                    }
                    catch(err) {}
                    try{
                        await this.setState({
                            publicationDates: this.state.publicationDates.filter((publicationDate, index) => index === this.state.publicationDates.findIndex(element => element.name === publicationDate.name))
                        })
                    }
                    catch(err) {}
                    try{
                        await this.setState({
                            prices: this.state.prices.filter((price, index) => index === this.state.prices.findIndex(element => element.name === price.name))
                        })
                    }
                    catch(err) {}
                    for(let k = this.state.books.length - 1; k >= (this.state.books.length > 3 ? this.state.books.length - 3 : 0); k--){
                        await this.setState({
                            carouselBooks: this.state.carouselBooks.concat(this.state.books[k])
                        })
                    }
                }
            }, () => {
            })
        }
        this.setState({
            isLoading: false,
        })
    }

    handleBookClick(event){
        let id = event.currentTarget.id
        this.setState({
            bookChosen: true,
            bookChosenId: id
        }, () => {
        })
    }

    filterBooksClick(){
        this.fetchBooks().then(() => {
            let filteredBooks = [];
            try{
                filteredBooks = this.state.books.filter((book) => book[this.state.filterOption].toLowerCase().includes(this.state.searchInput.toLowerCase()))
                this.setState({
                    books: filteredBooks
                })
            }
            catch (err) {}
        })
    }

    handleFilterChange(event){
        this.setState({
            filterOption: event.target.value,
            options: this.state[event.target.value + "s"]
        }, () => {
        })
    }

    handleSearchInputChange(event){
        this.setState({
            searchInput: event.target.value
        }, () => {
        })

    }

    searchOptionClick(event){
        try {
            this.setState({
                searchInput: event[0].name
            }, () => {
            })
        }
        catch(err) {

        }
    }

    updatePage(key){
            this.fetchBooks().then(() => {
                let filteredBooks = [];
                let fin = key * 20;
                if(this.state.books.length < fin){
                    fin = this.state.books.length;
                }
                for(let i = (key - 1) * 20; i < fin; i++){
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
        await this.setState({
            insufficientBalance: false
        })
        if(cookies.get('token') == null){
            await this.setState({
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
            }}).then(async resp => {
                if(resp.status == 200){
                    if(resp.data.insufficientUserBalance == true) {
                        await this.setState({
                            insufficientBalance: true
                        })
                        window.scrollTo(0, 0);
                    }
                    else {
                        await this.setState({
                            buyBookId: event.target.id,
                            buyBook: true
                        })
                    }
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

    sortAsc(that){
        let sortedBooks;
        let sortingOpt = that.state.sortingOption;
        if(sortingOpt == 'price'){
            sortingOpt = 'ourPrice';
        }
        try {
            sortedBooks = that.state.books.sort((a, b) => {
                if (a[sortingOpt] < b[sortingOpt]) return -1;
                if (a[sortingOpt] > b[sortingOpt]) return 1;
                return 0;
            })
            this.setState({
                books: sortedBooks
            })
        }
        catch(err) {}
    }


    sortDsc(that){
        let sortedBooks;
        let sortingOpt = that.state.sortingOption;
        if(sortingOpt == 'price'){
            sortingOpt = 'ourPrice';
        }
        try{
            sortedBooks = that.state.books.sort((a,b)=>{
                if(a[sortingOpt] > b[sortingOpt]) return -1;
                if(a[sortingOpt] < b[sortingOpt]) return 1;
                return 0;
            })
            this.setState({
                books: sortedBooks
            })
        }
        catch(err) {}
    }

    handleSortChange(event){
        this.setState({
            sortingOption: event.target.value
        })
    }

    sortBooks(event){
        if(event.target.value == 'asc'){
            this.sortAsc(this)
        }
        else{
            this.sortDsc(this)
        }
    }

    render() {
        const books = this.state.books.map((book) =>
            <Card style={{marginLeft: "4%", marginBottom: "40px", height: '600px', width: '20%', display: "inline-block", color: "white", backgroundColor: "#4c4c4c"}} id={book.id}>
                <Card.Body>
                    <Card.Img style={{width: "60%", height: "300px", cursor: "pointer"}} variant="top" src={book.bookImage} id={book.id} onClick={this.handleBookClick} onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src=imageApi.getImageUrl("0");
                    }}/>
                    <Card.Title style={{color: "#4cbde9"}} id={book.id} onClick={this.handleBookClick}>
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
                            <strong style={{textDecoration: 'line-through', color: "#f2575b", display: 'inline-block'}} hidden={book.listPrice == 0.0}>${book.listPrice}</strong> <p style={{display: 'inline-block'}}>${book.ourPrice}</p>
                        </div>
                        <EllipsisText style={{cursor: "pointer"}} text={book.description} id={book.id} onClick={this.handleBookClick} length={"130"} />
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
                            id={book.id}
                            className="d-block w-100 shelf-book"
                            src={book.bookImage}
                            alt="First book"
                            style={{display: "inline-block"}}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src=imageApi.getImageUrl("0");
                            }}
                        />
                        <Carousel.Caption style={{textShadow: "-1px -1px 10px #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}>
                            <h3>{book.title}</h3>
                            <EllipsisText text={book.description} length={"750"}/>
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
          <div style={{backgroundColor: "#212121", height: '100%', width: '100%'}}>
              {this.state.isLoading && <LoadingScreen/>}
              <div>
                  <NavbarTemplate/>
                  <br/>
              </div>

              <div hidden={this.state.isLoading} style={{backgroundColor: "#212121"}}>
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
                          <Form.Select style={{ width: "20%", backgroundColor: "#4c4c4c", color: "#4cbde9", fontWeight: "bold", cursor: "pointer"}} variant="info" onChange={this.handleFilterChange}>
                              <option value="title">Title</option>
                              <option value="author">Author</option>
                              <option value="category">Category</option>
                              <option value="language">Language</option>
                              <option value="publisher">Publisher</option>
                          </Form.Select>
                          <Typeahead
                              style={{width: "70%", marginLeft: "2%", fontWeight: "bold"}}
                              id="basic-typeahead-single"
                              labelKey="name"
                              onChange={this.searchOptionClick}
                              options={this.state.options}
                              placeholder="Search"
                          />
                          <Button style={{marginLeft: "1%", backgroundColor: "#4c4c4c", color: "#4cbde9", fontWeight: "bold"}} variant="light" onClick={this.filterBooksClick}>Search</Button>
                      </Form>
                      <br/>
                  </div>

                  <div style={{marginLeft: "50%", width: "60%"}}>
                      <Form className="d-flex">
                          <Form.Label style={{ width: "10%", color: "#4cbde9", textAlign: "right", marginTop: "1%", marginLeft: "15%", fontWeight: "bold"}}>
                              Filter with:
                          </Form.Label>
                          <Form.Select style={{ width: "15%", backgroundColor: "#4c4c4c", color: "#4cbde9", marginLeft: "2%", fontWeight: "bold", cursor: "pointer"}} variant="info" onChange={this.handleSortChange}>
                              <option value="title">Title</option>
                              <option value="author">Author</option>
                              <option value="category">Category</option>
                              <option value="language">Language</option>
                              <option value="publisher">Publisher</option>
                              <option value="publicationDate">Publication Date</option>
                              <option value="price">Price</option>
                          </Form.Select>
                          <Form.Label style={{ width: "10%", color: "#4cbde9", textAlign: "right", marginTop: "1%", fontWeight: "bold"}}>
                              Order:
                          </Form.Label>
                          <Form.Select style={{ width: "15%", backgroundColor: "#4c4c4c", color: "#4cbde9", marginLeft: "2%", fontWeight: "bold", cursor: "pointer"}} variant="info" onChange={this.sortBooks}>
                              <option value="asc">Ascending</option>
                              <option value="dsc">Descending</option>
                          </Form.Select>
                      </Form>
                      <br/>
                  </div>

                  <Tabs style={{alignItems: "center", justifyContent: "center", backgroundColor: "#212121", color: "#4cbde9"}} defaultActiveKey="1" className="mb-3" onSelect={this.updatePage}>
                      {pages}
                  </Tabs>

                  <div style={{height: "20%", marginTop: "50px", backgroundColor: "#212121"}}>
                      <div style={{textAlign: 'center'}}>
                          <h4 style={{color: "green"}} hidden> In stock</h4>
                          <h4 style={{color: "green"}} hidden> Only <span> in stock</span></h4>
                          <h4 style={{color: "darkred"}} hidden> Unavailable </h4>
                          <h2 style={{color: "#f2575b"}} hidden={!this.state.insufficientBalance}> Insufficient User Balance! </h2>
                      </div>
                      <Row style={{textAlign: "center", alignItems: "center", backgroundColor: "#212121"}} xs={5}>
                          {books.length > 0 ? books : (<p style={{textAlign: "center", color: "#4cbde9"}}>No Books in Store</p>)}
                      </Row>
                      <Footer/>
                  </div>
              </div>
          </div>
        );
    }
}

export {HomePage};
