import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import * as imageApi from "../../services/ImageApi";
import {PATH} from "../../services/ConfigurationUrlAService";
import Cookies from 'universal-cookie';
import {Navigate} from "react-router-dom";
import {Footer} from "../contact/Footer";

const cookies = new Cookies();

const URLAddress = PATH;

class BooksPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: window.location.href.split('#')[1],
            author: '',
            bookImage: '',
            category: '',
            description: '',
            inStockNumber: '',
            language: '',
            listPrice: '',
            numberOfPages: '',
            ourPrice: '',
            publicationDate: '',
            publisher: '',
            title: '',
            checkCart: false,
            quantity: [],
            buyBookId: '',
            buyBook: false,
            addToCartId: '',
            chosenQuantity: 1,
            insufficientBalance: false
        }

        this.fetchBookDetails = this.fetchBookDetails.bind(this)
        this.addToCart = this.addToCart.bind(this);
        this.buyBook = this.buyBook.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);

        this.fetchBookDetails()
    }

    async fetchBookDetails(){
            this.setState({
                bookChosen: false,
                bookChosenId: '',
                books: [],
                authors: [],
                categories: [],
                languages: [],
                publishers: [],
                quantity: [],
                buyBook: false,
                chosenQuantity: 1,
            })
            await axios.get(URLAddress + '/api/bookDetail', { params: { id: this.state.id } }).then(bookResp => {
                return bookResp.data.book;
            }).then(data => {
                this.setState({
                    id: data.id,
                    author: data.author,
                    bookImage: imageApi.getImageUrl(data.id),
                    category: data.category,
                    description: data.description,
                    inStockNumber: data.inStockNumber,
                    language: data.language,
                    listPrice: data.listPrice,
                    numberOfPages: data.numberOfPages,
                    ourPrice: data.ourPrice,
                    publicationDate: data.publicationDate,
                    publisher: data.publisher,
                    title: data.title
                })
                for(let i = 1; i <= (data.inStockNumber >= 9 ? 9 : data.inStockNumber); i++){
                    this.setState({
                        quantity: this.state.quantity.concat(i)
                    })
                }
            });
    }

    async buyBook(event){
        await cookies.remove('buyBook', { path: '/' });
        await cookies.set('buyBook', { "bookId": this.state.id, "quantity": 1 }, { path: '/' });
        await this.setState({
            insufficientBalance: false
        })
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
                    if(resp.data.insufficientUserBalance == true) {
                        await this.setState({
                            insufficientBalance: true
                        })
                        window.scrollTo(0, 0);
                    }
                    else {
                        await this.setState({
                            buyBookId: this.state.id,
                            buyBook: true
                        })
                    }
                }
            })
        }
    }

    async addToCart(event){
        await cookies.remove('addToCart', { path: '/' });
        await cookies.set('addToCart', { "bookId": this.state.id, "quantity": this.state.chosenQuantity }, { path: '/' });
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
                        addToCartId: this.state.id,
                        checkCart: true
                    })
                }
            })
        }
    }

    changeQuantity(event){
        this.setState({
            chosenQuantity: event.target.value
        })
    }

    render() {
        const quantity = this.state.quantity.map((numb) =>
            <option value={numb}>{numb}</option>
        )

        if (this.state.buyBook) {
            return <Navigate to={{pathname: "/checkout#id#" + cookies.get('buyBook').bookId + '#quantity#' + cookies.get('buyBook').quantity}} />
        }

        if (this.state.checkCart) {
            return <Navigate to={{pathname: "/shopping#id#" + cookies.get('addToCart').bookId + '#quantity#' + cookies.get('addToCart').quantity}} />
        }

        if(this.state.wantToBuyBook) {
            return <Navigate to={{pathname: "/login"}} />
        }

        return (
            <div style={{backgroundColor: "#212121", color: "#4cbde9"}}>
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div>
                    <form style={{marginLeft: "10%"}}>
                        <div class="row" style={{marginTop: "20px"}}>
                            <div style={{display: 'inline-block'}} class="col-xs-3">
                                <img src={this.state.bookImage} style={{width: '270px', height: '350px', marginLeft: '35%', display: "inline-block"}} class="img-responsive shelf-book"/>
                                <div style={{display: "inline-block"}}>
                                    <button className="btn btn-primary" name="addToCart"
                                            style={{
                                                backgroundColor: "#212121",
                                                color: "#4cbde9",
                                                marginLeft: '20px',
                                                display: 'block',
                                                border: "1px solid",
                                                padding: "10px 40px 10px 40px"
                                            }} onClick={this.addToCart}
                                    >Add to cart</button>
                                    <button className="btn btn-primary" name="buyBook" value=" Buy book" style={{
                                        backgroundColor: "#212121",
                                        color: "#4cbde9",
                                        marginLeft: '20px',
                                        marginTop: '20px',
                                        display: 'block',
                                        border: "1px solid",
                                        padding: "10px 40px 10px 40px"
                                    }} onClick={this.buyBook}
                                    >Buy book</button>
                                    <br/>
                                    <div style={{marginLeft: '40px'}}>
                                        <span>Quantity: </span>
                                        <select onChange={this.changeQuantity} name="qty">
                                            {quantity}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{textAlign: 'center'}}>
                                <h4 style={{color: "green"}} hidden> In stock</h4>
                                <h4 style={{color: "green"}} hidden> Only <span> in stock</span></h4>
                                <h4 style={{color: "darkred"}} hidden> Unavailable </h4>
                                <h2 style={{color: "#f2575b"}} hidden={!this.state.insufficientBalance}> Insufficient User Balance! </h2>
                            </div>

                            <div style={{display: 'inline-block'}} class="col-xs-9">
                                <h3><span style={{color: "forestgreen"}} hidden><i class="fa fa-check" aria-hidden="true" style={{color: "forestgreen"}}></i>Added to cart.</span></h3>
                                <h3><span style={{color: "red"}} hidden>Oops, only <span>{this.state.inStockNumber}</span> In Stock.</span></h3>
                                <h3>{this.state.title}</h3>
                                <div class="row">
                                    <div class="col-xs-5">
                                        <h5><strong>Author: </strong> <span>{this.state.author}</span></h5>
                                        <p><strong>Publisher: </strong> <span>{this.state.publisher}</span></p>
                                        <p><strong>Publication Date: </strong> <span>{this.state.publicationDate}</span></p>
                                        <p><strong>Language: </strong> <span>{this.state.language}</span></p>
                                        <p><strong>Category: </strong> <span>{this.state.category}</span></p>
                                        <p><strong>Number of pages: </strong><span>{this.state.numberOfPages}</span> </p>
                                        <p style={{width: '60%'}}><strong>Description: </strong>{this.state.description}</p>
                                    </div>

                                    <div class="col-xs-7">
                                        <div class="panel panel-default" style={{borderWidth: "5px", marginTop: "20px"}}>
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h4> Price: <span style={{color: "#db3208"}}>$<span>{this.state.ourPrice}</span></span></h4>
                                                        <p>Before Price: <span style={{textDecoration: "line-through"}}>$<span>{this.state.listPrice}</span></span></p>
                                                        <p>You save: $<span>{Math.floor((this.state.listPrice - this.state.ourPrice) * 100) / 100}</span>
                                                        </p>
                                                        <br/> <br/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <p></p>
                        </div>
                    </form>
                </div>
                <Footer/>
            </div>
        );
    }
}

export {BooksPage};
