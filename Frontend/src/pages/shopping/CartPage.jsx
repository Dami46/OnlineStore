import {Component} from 'react';
import {NavbarTemplate} from '../navbar/NavbarTemplate';import Cookies from 'universal-cookie';
import {getImageUrl} from "../../services/ImageApi";
import * as imageApi from "../../services/ImageApi";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {Footer} from "../contact/Footer";
import {LoadingScreen} from "../../services/LoadingScreen";

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
            newQuantity: [],
            quantityToSend: 0,
            insufficientBalance: false,
            isLoading: true,
        }

        this.getShoppingCart();
    }

    async getShoppingCart(){
        this.setState({
            isLoading: true,
        })
        await this.setState({
            id: '',
            products: [],
            totalPrice: 0,
            totalItems: 0,
            continueShopping: false,
            checkOut: false,
            insufficientBalance: false
        })
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
                    }),
                    newQuantity: this.state.newQuantity.concat({
                        id: cart.cartItemList[i].id,
                        quantity: cart.cartItemList[i].qty,
                    })
                })
            }
            this.setState({
                id: cart.shoppingCart.id,
                totalPrice: cart.shoppingCart.totalPrize,
            })
        })
        this.setState({
            isLoading: false,
        })
    }

    async handleDeleteClick(event){
        await axios.delete('/api/shoppingCart/removeItem', {data: {
            token: cookies.get('token'),
            cartItemId: event.target.id,
            qty: 0
        }})
        .then(resp => {
            return resp.status;
        }).then(status => {
            if(status == 200){
                this.getShoppingCart()
            }
        })
    }

    async handleUpdateClick(event){
        for(let i = 0; i < this.state.newQuantity.length; i++){
            if(this.state.newQuantity[i].id == event.target.id){
                await this.setState({
                    quantityToSend: this.state.newQuantity[i].quantity
                })
            }
        }
        await axios.put('/api/shoppingCart/updateCartItem', {
            token: cookies.get('token'),
            cartItemId: event.target.id,
            qty: this.state.quantityToSend
        })
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
        for(let i = 0; i < this.state.newQuantity.length; i++){
            if(this.state.newQuantity[i].id == event.target.id){
                this.state.newQuantity[i].quantity = event.target.value;
            }
        }
    }

    handleContinueShoppingClick(){
        this.setState({
            continueShopping: true,
        })
    }

    async handleCheckoutClick(){
        await cookies.remove('cartCheckout', { path: '/' });
        await cookies.set('cartCheckout', this.state.id, { path: '/' });
        await this.setState({
            insufficientBalance: false
        })
        if(cookies.get('token') == null){
            this.setState({
                wantToBuyBook: true
            })
        }
        else{
            await axios.post('/api/shoppingCart/buyItems?id=' + cookies.get('cartCheckout') + '&token=' + cookies.get('token'))
            .then(async resp =>{
                return resp;
            }).then(async cart => {
                if(cart.status == 200){
                    await this.setState({
                        checkOut: true,
                    })
                }
            }).catch(async err => {
                await this.setState({
                    insufficientBalance: true
                })
            })
        }
        // this.setState({
        //     checkOut: true,
        // })
    }

    render() {

        const products = this.state.products.map((product) =>
            <tr style={{backgroundColor: "#212121", color: "#4cbde9"}}>
                <td style={{width: "20%"}} className="text-center">
                    <a>
                        <img src={imageApi.getImageUrl(product.book.id)} style={{width: "65px"}} className="img-responsive shelf-book center-block"/>
                    </a>
                </td>
                <td style={{width: "20%"}} className="text-center">
                    <div>
                        <a><h4>{product.book.title}</h4></a>
                        {product.book.inStockNumber > 10 ?
                            (<p style={{color: "green"}}>In Stock: {product.book.inStockNumber}</p>) :
                            product.book.inStockNumber > 0 ?
                                (<p style={{color: "yellow"}}>
                                    Only <span>{product.book.inStockNumber}</span> In Stock
                                </p>) :
                                (<p style={{color: "darkred"}}>Product Unavailable</p>)
                        }
                        <button className="btn btn-primary" id={product.id} onClick={this.handleDeleteClick}>Delete</button>
                    </div>
                </td>

                <td style={{width: "20%"}} className="text-center">
                    <h5 style={{color: "#db3208", fontSize: "large", textAlign: "center"}}>$<span>{product.price}</span></h5>
                </td>

                <td style={{width: "10%"}} className="text-center">
                    <input style={{textAlign: "center"}} className="form-control cartItemQty" id={product.id} placeholder={product.quantity} onChange={this.handleQuantityChange}/>
                    <button style={{marginTop: "10px"}} className={"btn btn-primary " + product.id} id={product.id} onClick={this.handleUpdateClick}> Update
                    </button>
                </td>
            </tr>
        )

        if(this.state.continueShopping == true){
            return <Navigate to={{pathname: "/home"}} />
        }

        if(this.state.checkOut == true){
            return <Navigate to={{pathname: "/cartcheckout"}} />
        }

        return (
            <div style={{backgroundColor: "#212121", color: "#4cbde9", height: '100%', minHeight: '100vh'}}>
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
                    <div style={{textAlign: 'center'}}>
                        <h2 style={{color: "green"}} hidden> In stock</h2>
                        <h2 style={{color: "green"}} hidden> Only <span> in stock</span></h2>
                        <h4 style={{color: "darkred"}} hidden> Unavailable </h4>
                        <h2 style={{color: "#f2575b"}} hidden={!this.state.insufficientBalance}> Insufficient User Balance! </h2>
                    </div>

                    <div className="row" style={{marginTop: "10px", marginLeft: '10%', width: '80%'}}>
                        <div className="col-xs-12">
                            <div style={{display: "inline-block"}} className="col-xs-6 text-left">
                                <button className="btn btn-primary" onClick={this.handleContinueShoppingClick}> Continue shopping</button>
                            </div>
                            <div style={{display: "inline-block", float: 'right'}} className="col-xs-6 text-right">
                                <button className="btn btn-primary" disabled={this.state.products.length == 0} onClick={this.handleCheckoutClick}> Check out</button>
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
                            <table style={{color: "white"}} className="table table-condensed">
                                <thead>
                                    <tr>
                                        <td></td>
                                        <td className="text-center"><h4>Products</h4></td>
                                        <td className="text-center"><h4>Price</h4></td>
                                        <td className="text-center"><h4>Quantity</h4></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products}
                                </tbody>
                            </table>

                            <div style={{marginTop: '10px'}} className="row">
                                <hr/>
                                <h4 className="col-xs-12 text-right">
                                    <strong style={{fontSize: "large"}}>Total Price (<span>{this.state.products.length}</span> items):
                                    </strong> <span style={{color: "#db3208", fontSize: "large"}}>$<span>{this.state.totalPrice}</span></span>
                                </h4>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export {CartPage};
