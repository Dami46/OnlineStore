import {Component} from 'react';
import {NavbarTemplate} from '../navbar/NavbarTemplate';import Cookies from 'universal-cookie';
import {getImageUrl} from "../../services/ImageApi";
import * as imageApi from "../../services/ImageApi";
import axios from "axios";
import {Navigate} from "react-router-dom";

const cookies = new Cookies();

class CartPage extends Component {
    constructor(props) {
        super(props);

        this.getShoppingCart = this.getShoppingCart.bind(this);

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleContinueShoppingClick = this.handleContinueShoppingClick.bind(this);
        this.handleCheckoutClick = this.handleCheckoutClick.bind(this);

        this.state = {
            id: '',
            products: [],
            totalPrice: 0,
            totalItems: 0,
            continueShopping: false,
            checkOut: false,
            newQuantity: 0
        }

        this.getShoppingCart();
    }

    async getShoppingCart(){
        await axios.get('/api/shoppingCart/cart', { params: {
            token: cookies.get('token')
        }}).then(resp => {
            return resp.data
        }).then(cart => {
            console.log(cart)
            for(let i = 0; i < cart.cartItemList.length; i++){
                this.setState({
                    products: this.state.products.concat({
                        id: cart.cartItemList[i].id,
                        price: cart.cartItemList[i].subtotal,
                        quantity: cart.cartItemList[i].qty,
                        book: cart.cartItemList[i].book,
                    })
                })
            }
            this.setState({
                id: cart.shoppingCart.id,
                totalPrice: cart.shoppingCart.totalPrize,
            })
        })
    }

    async handleDeleteClick(event){
        await axios.delete('/api/shoppingCart/removeItem?id=' + event.target.id)
        .then(resp => {
            return resp.status;
        }).then(status => {
            if(status == 200){
                this.getShoppingCart()
            }
        })
    }

    async handleUpdateClick(event){
        await axios.put('/api/updateCartItem')
            .then(resp => {
                return resp.status;
            }).then(status => {
                if(status == 200){
                    this.getShoppingCart()
                }
            })
    }

    handleQuantityChange(event){
        document.getElementsByClassName(event.target.id)[0].disabled = false;
    }

    handleContinueShoppingClick(){
        this.setState({
            continueShopping: true,
        })
    }

    handleCheckoutClick(){
        this.setState({
            checkOut: true,
        })
    }

    render() {
        const products = this.state.products.map((product) =>
            <div className="row">
                <div method="post">
                    <hr/>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{display: "inline-block"}}>
                            <a>
                                <img src={imageApi.getImageUrl(product.book.id)} style={{width: "65px"}} className="img-responsive shelf-book center-block"/>
                            </a>
                        </div>
                        <div style={{display: "inline-block"}}>
                            <div style={{marginLeft: "50px"}}>
                                <a><h4>{product.book.title}</h4></a>
                                <p style={{color: "green"}}>In Stock: {product.book.inStockNumber}</p>
                                <p style={{color: "green"}} hidden>
                                    Only <span></span> In
                                    Stock
                                </p>
                                <p style={{color: "darkred"}} hidden>Product Unavailable</p>
                                <button className="btn btn-primary" id={product.id} onClick={this.handleDeleteClick}>delete</button>
                            </div>
                        </div>

                        <div style={{display: "inline-block", marginLeft: "3%"}}>
                            <h5 style={{color: "#db3208", fontSize: "large", textAlign: "center"}}>$<span>{product.price}</span></h5>
                        </div>

                        <div style={{display: "inline-block", marginLeft: "30%"}}>
                            <input hidden="hidden" name="id"/>
                            <input className="form-control cartItemQty" style={{display: "inline-block"}} id={product.id} placeholder={product.quantity} onChange={this.handleQuantityChange}/>
                            <button style={{marginTop: "10px"}} type="submit" className={"btn btn-primary " + product.id} disabled={true} id={product.id} onChange={this.handleUpdateClick}> Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )

        if(this.state.continueShopping == true){
            return <Navigate to={{pathname: "/home"}} />
        }

        return (
            <div>
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div className="row" style={{marginTop: "10px", marginLeft: '10%', width: '80%'}}>
                    <div className="col-xs-12">
                        <div style={{display: "inline-block"}} className="col-xs-6 text-left">
                            <a className="btn btn-primary" onClick={this.handleContinueShoppingClick}> Continue shopping</a>
                        </div>
                        <div style={{display: "inline-block", float: 'right'}} className="col-xs-6 text-right">
                            <a className="btn btn-primary" onClick={this.handleCheckoutClick}> Check out</a>
                        </div>
                        <br/> <br/> <br/>
                        <div className="alert alert-warning" hidden>
                            Oops, some of the products don't have enough stock. Please update product quantity.
                        </div>
                        <div className="alert alert-warning" hidden>
                            Oops, your cart is empty.
                        </div>
                        <div className="alert alert-warning" hidden>
                            You dont have enough money in your balance to complete checkout.
                        </div>

                        <br/><br/>

                        <div>
                            <div style={{display: "inline-block"}}><h4>Products</h4></div>
                            <div style={{display: "inline-block", marginLeft: "30%"}}><h4>Price</h4></div>
                            <div style={{display: "inline-block", marginLeft: "30%"}}><h4>Quantity</h4></div>
                        </div>

                        <div>
                            {products}
                        </div>

                        <div style={{marginTop: '10px'}} className="row">
                            <hr/>
                            <h4 className="col-xs-12 text-right">
                                <strong style={{fontSize: "large"}}>Total Price (<span>{this.state.products.length}</span> items):
                                </strong> <span style={{color: "#db3208", fontSize: "large"}}>$<span>{this.state.totalPrice}</span></span>
                            </h4>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export {CartPage};