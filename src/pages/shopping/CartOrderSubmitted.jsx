import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import Cookies from 'universal-cookie';
import * as imageApi from "../../services/ImageApi";
import {Footer} from "../contact/Footer";

const cookies = new Cookies();

class CartOrderSubmittedPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: cookies.get('cartCheckoutSubmit').products,
            totalPrice: cookies.get('cartCheckoutSubmit').price
        }
    }

    render() {
        const products = this.state.products.map((product) =>
            <div className="row" style={{backgroundColor: "#212121", color: "#4cbde9", height: '100vh', minHeight: '100vh'}}>
                <hr/>
                <div style={{display: "inline-block"}}>
                    <a> <img src={imageApi.getImageUrl(product.image)}
                             className="img-responsive shelf-book"
                             style={{width: "70px"}}/>
                    </a>
                </div>
                <div style={{display: "inline-block"}}>
                    <div>
                        <a>
                            <br/>
                            <h4>Title: {product.title}</h4>
                            <h4>Author: {product.author}</h4>
                            <h4>Quantity: {product.quantity}</h4>
                            <h4>Price: ${product.price}</h4>
                            <br/>
                        </a>
                    </div>
                </div>

                <div>
                    <h5 style={{color: "#db3208", fontSize: "large"}}>
                        Subtotal: $<span>{product.subtotal}</span>
                    </h5>
                </div>
            </div>
        )

        return(
            <div>
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
                                Total: ${this.state.totalPrice}
                            </h3>

                            <input hidden="hidden"/>
                        </div>

                        <h3>Item</h3>
                        {products}
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export {CartOrderSubmittedPage};