import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import * as imageApi from "../../services/ImageApi";
import {PATH} from "../../services/ConfigurationUrlAService";
import Cookies from 'universal-cookie';
import {Navigate} from "react-router-dom";
import {Footer} from "../contact/Footer";
import {LoadingScreen} from "../../services/LoadingScreen";

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
            insufficientBalance: false,
            isLoading: true,
        }

        this.fetchBookDetails = this.fetchBookDetails.bind(this)
        this.addToCart = this.addToCart.bind(this);
        this.buyBook = this.buyBook.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);

        this.fetchBookDetails()
    }

    async fetchBookDetails(){
        this.setState({
            isLoading: true,
        })
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
        this.setState({
            isLoading: false,
        })
    }

    async buyBook(){
        this.setState({
            isLoading: true,
        })
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
                console.log(resp)
                console.log(cookies.get('buyBook'))
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
        this.setState({
            isLoading: false,
        })
        console.log(this.state.buyBook)
    }

    async addToCart(){
        this.setState({
            isLoading: true,
        })
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
        this.setState({
            isLoading: false,
        })
        console.log(this.state.checkCart)
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
            // return <Navigate to={{pathname: "/checkout"}} />
        }

        if (this.state.checkCart) {
            return <Navigate to={{pathname: "/shopping#id#" + cookies.get('addToCart').bookId + '#quantity#' + cookies.get('addToCart').quantity}} />
            // return <Navigate to={{pathname: "/shopping"}} />
        }

        if(this.state.wantToBuyBook) {
            return <Navigate to={{pathname: "/login"}} />
        }

        return (
            <div style={{backgroundColor: "#212121", color: "#4cbde9"}}>
                {this.state.isLoading && <LoadingScreen/>}
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div hidden={this.state.isLoading}>
                    <div style={{marginLeft: "10%"}}>
                        <div class="row" style={{marginTop: "20px"}}>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <img src={this.state.bookImage} style={{width: '270px', height: '350px', marginLeft: '35%', display: "inline-block"}} class="img-responsive shelf-book"/>
                                <div style={{display: "inline-block", marginLeft: '20px'}}>
                                    <br/>
                                    <button className="btn btn-primary" name="addToCart"
                                            disabled={this.state.inStockNumber == 0}
                                            style={{
                                                backgroundColor: "#212121",
                                                color: "#4cbde9",
                                                marginLeft: '20px',
                                                display: 'block',
                                                border: "1px solid",
                                                padding: "10px 40px 10px 40px"
                                            }} onClick={this.addToCart}
                                    >Add to cart</button>
                                    <button className="btn btn-primary" name="buyBook"
                                        disabled={this.state.inStockNumber == 0}
                                        style={{
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
                                    <div style={{marginLeft: '40px'}} hidden={this.state.inStockNumber == 0}>
                                        <span>Quantity: </span>
                                        <select onChange={this.changeQuantity} name="qty">
                                            {quantity}
                                        </select>
                                    </div>
                                    <br/>
                                    <div style={{textAlign: "center"}}>
                                        <h4> Price: <span>$<span>{this.state.ourPrice}</span></span>
                                        </h4>
                                        <p hidden={this.state.listPrice == 0.0}>Before Price: <span
                                            style={{textDecoration: "line-through", color: "#db3208"}}>$<span>{Math.round(this.state.listPrice * 100) / 100}</span></span>
                                        </p>
                                        <p hidden={this.state.listPrice == 0.0}>You save:
                                            $<span>{Math.floor((this.state.listPrice - this.state.ourPrice) * 100) / 100}</span>
                                        </p>
                                        <br/> <br/>
                                    </div>
                                </div>
                            </div>

                            <div style={{textAlign: 'center'}}>
                                <h2 style={{color: "green"}} hidden> In stock</h2>
                                <h2 style={{color: "yellow"}} hidden={!(this.state.inStockNumber < 10 && this.state.inStockNumber > 0)}> Only {this.state.inStockNumber}<span> in stock</span></h2>
                                <h2 style={{color: "#f2575b"}} hidden={!this.state.inStockNumber == 0}> Unavailable </h2>
                                <h2 style={{color: "#f2575b"}} hidden={!this.state.insufficientBalance}> Insufficient User Balance! </h2>
                            </div>

                            <div style={{display: 'inline-block'}} class="col-xs-9">
                                <h3><span style={{color: "forestgreen"}} hidden><i class="fa fa-check" aria-hidden="true" style={{color: "forestgreen"}}></i>Added to cart.</span></h3>
                                <h3><span style={{color: "#f2575b"}} hidden>Oops, only <span>{this.state.inStockNumber}</span> In Stock.</span></h3>
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
                                </div>
                            </div>
                        <p></p>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export {BooksPage};
