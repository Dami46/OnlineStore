import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import Cookies from 'universal-cookie';
import * as imageApi from "../../services/ImageApi";
import {Footer} from "../contact/Footer";

const cookies = new Cookies();

class OrderSubmittedPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookId: cookies.get('checkout').bookId,
            bookImage: imageApi.getImageUrl(cookies.get('checkout').bookId),
            bookTitle: cookies.get('checkout').bookTitle,
            bookAuthor: cookies.get('checkout').bookAuthor,
            bookPrice: cookies.get('checkout').price,
            bookTotal: cookies.get('checkout').price + (cookies.get('checkout').shippingOption == "premiumShipping" ? 10 : 5)
        }
    }

    render() {
        return(
            <div style={{backgroundColor: "#212121", color: "#4cbde9", height: '100vh', minHeight: '100vh'}}>
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div>
                    <div style={{textAlign: 'center'}}>
                        <h2 className="section-headline">
                            <span>Your Order</span>
                        </h2>
                    </div>
                </div>

                <div className="row" style={{marginTop: "10px", textAlign: "center"}}>
                    <div>
                        <div className="alert alert-success">
                            <h3>
                                <i className="fa fa-check" aria-hidden="true"
                                   style={{color: "limegreen"}}></i> Thank you, your order has been
                                placed.
                            </h3>

                            <h3 style={{color: "red"}}>
                                Total: ${this.state.bookTotal}
                            </h3>
                            <input hidden="hidden"/>
                        </div>

                        <h3>Item</h3>
                        <div className="row">
                            <hr/>
                            <div>

                                <a> <img src={this.state.bookImage}
                                    className="img-responsive shelf-book"
                                    style={{width: "70px"}}/>
                                </a>
                            </div>
                            <div>
                                <div>
                                    <a>
                                        <br/>
                                        <h4>Title: {this.state.bookTitle}</h4>
                                        <h4>Author: {this.state.bookAuthor}</h4>
                                        <h4>Quantity: 1</h4>
                                        <h4>Price: ${this.state.bookPrice}</h4>
                                        <br/>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h5 style={{color: "#db3208", fontSize: "large"}}>
                                    Price: $<span>{this.state.bookTotal}</span>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export {OrderSubmittedPage};