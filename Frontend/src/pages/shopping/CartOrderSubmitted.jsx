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
            <tr>
                <td style={{textAlign: "center", cursor: "pointer"}}>
                    <img style={{width: "60px", height: '80px', display: 'inline-block', marginBottom: '5%'}} src={imageApi.getImageUrl(product.image)} id={product.id} onClick={this.chooseBook}/>
                    <div style={{display: 'inline-block', marginLeft: '10px'}}>
                        <p id={product.bookId} onClick={this.chooseBook}>
                            {product.title}
                            <br/>
                            {product.author}
                        </p>
                    </div>
                </td>
                <td style={{textAlign: "center"}}>${Math.round(product.price * 100) / 100}</td>
                <td style={{textAlign: "center"}}>{product.quantity}</td>
                <td style={{textAlign: "center"}}>${Math.round(product.subtotal * 100) / 100}</td>
            </tr>
            // <div className="row" style={{backgroundColor: "#212121", color: "#4cbde9"}}>
            //     <div style={{display: "inline-block", marginTop: '50px'}}>
            //         <img src={imageApi.getImageUrl(product.image)}
            //                  className="img-responsive shelf-book"
            //                  style={{width: "70px"}}/>
            //         <p>Title: {product.title}</p>
            //         <p>Author: {product.author}</p>
            //         <p>Quantity: {product.quantity}</p>
            //         <p>Price: ${product.price}</p>
            //     </div>
            //
            //     <div>
            //         <h5 style={{color: "#db3208", fontSize: "large"}}>
            //             Subtotal: $<span>{product.subtotal}</span>
            //         </h5>
            //     </div>
            // </div>
        )

        return(
            <div style={{backgroundColor: "#212121", color: "#4cbde9", height: "100vh"}}>
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
                                Total: ${Math.round(this.state.totalPrice * 100) / 100}
                            </h3>

                            <input hidden="hidden"/>
                        </div>
                        <table style={{color: "#4cbde9", marginLeft: "20%", width: "60%"}} className="table table-condensed">
                            <thead>
                            <tr>
                                <td><strong>Item</strong></td>
                                <td className="text-center"><strong>Item Price</strong></td>
                                <td className="text-center"><strong>Item Quantity</strong></td>
                                <td className="text-right">
                                    <strong>Subtotal</strong></td>
                            </tr>
                            </thead>
                            <tbody>
                                {products}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export {CartOrderSubmittedPage};