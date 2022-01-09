import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import {Nav, Tabs, Col, Row} from "react-bootstrap";
import {Tab} from "bootstrap";
import axios from "axios";
import Cookies from 'universal-cookie';
import * as imageApi from "../../services/ImageApi";
import {Navigate} from "react-router-dom";

const cookies = new Cookies();

const tableHeaderStyle = {
    fontSize: "25px",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center"
}

const tableBodyStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    width: "70%",
    marginLeft: "15%",
    textAlign: "center"
}

class CartCheckout extends Component {
    constructor(props) {
        super(props);

        this.changeActiveTab = this.changeActiveTab.bind(this);
        this.goToPayment = this.goToPayment.bind(this);
        this.goToReview = this.goToReview.bind(this);

        this.getCartDetails = this.getCartDetails.bind(this);

        this.shippingInfoNameInputChange = this.shippingInfoNameInputChange.bind(this);
        this.shippingInfoStreet1InputChange = this.shippingInfoStreet1InputChange.bind(this);
        this.shippingInfoStreet2InputChange = this.shippingInfoStreet2InputChange.bind(this);
        this.shippingInfoCityInputChange = this.shippingInfoCityInputChange.bind(this);
        this.shippingInfoStateInputChange = this.shippingInfoStateInputChange.bind(this);
        this.shippingInfoCountryInputChange = this.shippingInfoCountryInputChange.bind(this);
        this.shippingInfoZipcodeInputChange = this.shippingInfoZipcodeInputChange.bind(this);
        this.paymentInfoNameInputChange = this.paymentInfoNameInputChange.bind(this);
        this.paymentInfoStreet1InputChange = this.paymentInfoStreet1InputChange.bind(this);
        this.paymentInfoStreet2InputChange = this.paymentInfoStreet2InputChange.bind(this);
        this.paymentInfoCityInputChange = this.paymentInfoCityInputChange.bind(this);
        this.paymentInfoStateInputChange = this.paymentInfoStateInputChange.bind(this);
        this.paymentInfoCountryInputChange = this.paymentInfoCountryInputChange.bind(this);
        this.paymentInfoZipcodeInputChange = this.paymentInfoZipcodeInputChange.bind(this);
        this.samePaymentAndBilling = this.samePaymentAndBilling.bind(this);
        this.changeShipping = this.changeShipping.bind(this);
        this.cartCheckout = this.cartCheckout.bind(this);
        this.checkShipping = this.checkShipping.bind(this);
        this.checkPayment = this.checkPayment.bind(this);

        this.state = {
            activeTab: 'shippingInfo',
            paymentDisabled: true,
            reviewDisabled: true,
            shippingInfoName: '',
            shippingInfoStreet1: '',
            shippingInfoStreet2: '',
            shippingInfoCity: '',
            shippingInfoState: '',
            shippingInfoCountry: '',
            shippingInfoZipcode: '',
            paymentInfoName: '',
            paymentInfoStreet1: '',
            paymentInfoStreet2: '',
            paymentInfoCity: '',
            paymentInfoState: '',
            paymentInfoCountry: '',
            paymentInfoZipcode: '',
            shippingOption: 'groundShipping',
            samePaymentAndShipping: false,
            products: [{
                title: '',
                price: '',
                subtotal: '',
                image: '',
                quantity: '',
                author: ''
            }],
            orderSuccess: false,
            totalPrice: ''
        }

        this.getCartDetails()
    }

    async getCartDetails(){
        await axios.get('/api/shoppingCart/cartCheckout?id=' + cookies.get('cartCheckout') + '&token=' + cookies.get('token'))
            .then(async resp =>{
                return resp.data;
            }).then(cart => {
                this.setState({
                    totalPrice: cart.shoppingCart.totalPrize,
                    products: [],
                })
                for(let i = 0; i < cart.cartItemList.length; i++){
                    this.setState({
                        products: this.state.products.concat({
                            title: cart.cartItemList[i].book.title,
                            price: cart.cartItemList[i].book.ourPrice,
                            subtotal: cart.cartItemList[i].subtotal,
                            image: cart.cartItemList[i].book.id,
                            quantity: cart.cartItemList[i].qty,
                            author: cart.cartItemList[i].book.author
                        })
                    })
                }
            })
    }

    changeActiveTab(key){
        this.setState({
            activeTab: key
        })
    }

    checkShipping(){
        if(this.state.shippingInfoName == '' ||
            this.state.shippingInfoStreet1 == '' ||
            this.state.shippingInfoStreet2 == '' ||
            this.state.shippingInfoCity == '' ||
            this.state.shippingInfoState == '' ||
            this.state.shippingInfoCountry == '' ||
            this.state.shippingInfoZipcode == ''){
            this.setState({
                paymentDisabled: true
            })
        }
        else {
            this.setState({
                paymentDisabled: false
            })
        }
    }

    checkPayment(){
        if(this.state.paymentInfoName == '' ||
            this.state.paymentInfoStreet1 == '' ||
            this.state.paymentInfoStreet2 == '' ||
            this.state.paymentInfoCity == '' ||
            this.state.paymentInfoState == '' ||
            this.state.paymentInfoCountry == '' ||
            this.state.paymentInfoZipcode == ''){
            this.setState({
                reviewDisabled: true
            })
        }
        else {
            this.setState({
                reviewDisabled: false
            })
        }
    }

    goToPayment(){
        this.setState({
            activeTab: 'paymentInfo'
        })
    }

    goToReview(){
        this.setState({
            activeTab: 'reviewItems'
        })
    }

    shippingInfoNameInputChange(event){
        this.setState({
            shippingInfoName: event.target.value
        })
        this.checkShipping();
    }

    shippingInfoStreet1InputChange(event){
        this.setState({
            shippingInfoStreet1: event.target.value
        })
        this.checkShipping();
    }

    shippingInfoStreet2InputChange(event){
        this.setState({
            shippingInfoStreet2: event.target.value
        })
        this.checkShipping();
    }

    shippingInfoCityInputChange(event){
        this.setState({
            shippingInfoCity: event.target.value
        })
        this.checkShipping();
    }

    shippingInfoStateInputChange(event){
        this.setState({
            shippingInfoState: event.target.value
        })
        this.checkShipping();
    }

    shippingInfoCountryInputChange(event){
        this.setState({
            shippingInfoCountry: event.target.value
        })
        this.checkShipping();
    }

    shippingInfoZipcodeInputChange(event){
        this.setState({
            shippingInfoZipcode: event.target.value
        })
        this.checkShipping();
    }

    paymentInfoNameInputChange(event){
        this.setState({
            paymentInfoName: event.target.value
        })
        this.checkPayment();
    }

    paymentInfoStreet1InputChange(event){
        this.setState({
            paymentInfoStreet1: event.target.value
        })
        this.checkPayment();
    }

    paymentInfoStreet2InputChange(event){
        this.setState({
            paymentInfoStreet2: event.target.value
        })
        this.checkPayment();
    }

    paymentInfoCityInputChange(event){
        this.setState({
            paymentInfoCity: event.target.value
        })
        this.checkPayment();
    }

    paymentInfoStateInputChange(event){
        this.setState({
            paymentInfoState: event.target.value
        })
        this.checkPayment();
    }

    paymentInfoCountryInputChange(event){
        this.setState({
            paymentInfoCountry: event.target.value
        })
        this.checkPayment();
    }

    paymentInfoZipcodeInputChange(event){
        this.setState({
            paymentInfoZipcode: event.target.value
        })
        this.checkPayment();
    }

    samePaymentAndBilling(){
        if(!this.state.samePaymentAndBilling == true){
            this.setState({
                samePaymentAndBilling: true,
                paymentInfoName: this.state.shippingInfoName,
                paymentInfoStreet1: this.state.shippingInfoStreet1,
                paymentInfoStreet2: this.state.shippingInfoStreet2,
                paymentInfoCity: this.state.shippingInfoCity,
                paymentInfoState: this.state.shippingInfoState,
                paymentInfoCountry: this.state.shippingInfoCountry,
                paymentInfoZipcode: this.state.shippingInfoZipcode,
            })
        }
        else{
            this.setState({
                samePaymentAndBilling: false,
                paymentInfoName: '',
                paymentInfoStreet1: '',
                paymentInfoStreet2: '',
                paymentInfoCity: '',
                paymentInfoState: '',
                paymentInfoCountry: '',
                paymentInfoZipcode: '',
            })
        }
    }

    changeShipping(event){
        this.setState({
            shippingOption: event.target.value
        })
    }

    async cartCheckout(){
        console.log(this.state)
        await axios.post('/api/shoppingCart/cartCheckout', {
            shippingAddress: {
                shippingAddressName: this.state.shippingInfoName,
                shippingAddressStreet1: this.state.shippingInfoStreet1,
                shippingAddressStreet2: this.state.shippingInfoStreet2,
                shippingAddressCity: this.state.shippingInfoCity,
                shippingAddressState: this.state.shippingInfoState,
                shippingAddressCountry: this.state.shippingInfoCountry,
                shippingAddressZipcode: this.state.shippingInfoZipcode,
            },
            billingAddress: {
                billingAddressName: this.state.paymentInfoName,
                billingAddressStreet1: this.state.paymentInfoStreet1,
                billingAddressStreet2: this.state.paymentInfoStreet2,
                billingAddressCity: this.state.paymentInfoCity,
                billingAddressState: this.state.paymentInfoState,
                billingAddressCountry: this.state.paymentInfoCountry,
                billingAddressZipcode: this.state.paymentInfoZipcode,
            },
            shippingMethod: this.state.shippingOption,
            token: cookies.get('token')
        })
            .then(async resp => {
                if(resp.status == 200){
                    this.setState({
                        orderSuccess: true
                    })
                }
            })

    }

    render() {
        if(this.state.orderSuccess == true){
            return <Navigate to={{pathname: "/orderSubmitted"}} />
        }

        const products = this.state.products.map((product) =>
            <tr>
                <td style={{textAlign: "center"}}>
                    <img style={{width: "60px", height: '80px', display: 'inline-block'}} src={imageApi.getImageUrl(product.image)}/>
                    <div style={{display: 'inline-block', marginLeft: '10px'}}>
                        <p>
                            {product.title}
                            <br/>
                            {product.author}
                        </p>
                    </div>
                </td>
                <td style={{textAlign: "center"}}>${product.price}</td>
                <td style={{textAlign: "center"}}>{product.quantity}</td>
                <td style={{textAlign: "center"}}>${product.subtotal}</td>
            </tr>
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

                <div className="container">
                    <div className="row">
                        <div>
                            <h2 className="section-headline">
                                <span>Cart Checkout</span>
                            </h2>
                        </div>
                    </div>

                    <div className="row" style={{marginTop: "10px", textAlign: "center"}}>
                        <div method="post">
                            <input hidden="hidden"/>
                            <div className="col-xs-4">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <h3>Order Summary</h3>
                                        <div className="row">
                                            <div className="col-xs-7 text-left">Total</div>
                                            <div className="col-xs-5 text-right">
                                                $<span>{this.state.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-8">
                                <div>
                                    <h5 className="alert alert-warning" hidden>There are some fields
                                        missing. Field with * is required.</h5>
                                </div>

                                <Tabs style={tableHeaderStyle} activeKey={this.state.activeTab} defaultActiveKey="shippingInfo" className="mb-3" onSelect={this.changeActiveTab}>
                                    <Tab style={tableBodyStyle} eventKey="shippingInfo" title="Shipping Info">
                                        <div id="shippingInfo">
                                            <div className="panel-body">
                                                <div className="form-group">
                                                    <label htmlFor="shippingName">* Name</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingName" required="required" placeholder="Receiver Name" name="shippingAddressName" onChange={this.shippingInfoNameInputChange}/>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="shippingStreet">* Street Address</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingStreet" required="required" placeholder="Street Address 1" name="shippingAddressStreet1" onChange={this.shippingInfoStreet1InputChange}/>
                                                </div>
                                                <div className="form-group">
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" placeholder="Street Address 2" name="shippingAddressStreet2" onChange={this.shippingInfoStreet2InputChange}/>
                                                </div>

                                                <div className="row">
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingCity">* City</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingCity" placeholder="Shipping City" required="required" onChange={this.shippingInfoCityInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingState">* State</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingState" placeholder="Shipping State" required="required" onChange={this.shippingInfoStateInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingCountry">* City</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingCountry" placeholder="Shipping Country" required="required" onChange={this.shippingInfoCountryInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingZipcode">* Zipcode</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingZipcode" placeholder="Shipping Zipcode" required="required" onChange={this.shippingInfoZipcodeInputChange}/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <br/>
                                                <button data-toggle="collapse" data-parent="#accordion"
                                                        className="btn btn-primary pull-right" href="#paymentInfo" disabled={this.state.paymentDisabled} onClick={this.goToPayment}>Next</button>
                                            </div>
                                        </div>
                                    </Tab>

                                    <Tab style={tableBodyStyle} eventKey="paymentInfo" title="Payment Info" disabled={this.state.paymentDisabled}>
                                        <div id="paymentInfo">
                                            <div className="panel-body">
                                                <div className="checkbox">
                                                    <label>
                                                        <input style={{textAlign: 'center'}} id="theSameAsShippingAddress" type="checkbox" name="billingSameAsShipping" value="true" onChange={this.samePaymentAndBilling}/>
                                                        The same as shipping address
                                                    </label>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="billingName">* Name</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingName" placeholder="Receiver Name" required="required" value={this.state.paymentInfoName} onChange={this.paymentInfoNameInputChange}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="billingAddress">* Street Address</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingAddress" placeholder="Street Address 1" required="required" value={this.state.paymentInfoStreet1} onChange={this.paymentInfoStreet1InputChange}/>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingAddress" placeholder="Street Address 2" value={this.state.paymentInfoStreet2} onChange={this.paymentInfoStreet2InputChange}/>
                                                </div>

                                                <div className="row">
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="billingCity">* City</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingCity" placeholder="Billing City" required="required"  value={this.state.paymentInfoCity} onChange={this.paymentInfoCityInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="billingState">* State</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingCity" placeholder="Billing State" required="required"  value={this.state.paymentInfoState} onChange={this.paymentInfoStateInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="billingCity">* Country</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingCountry" placeholder="Billing Country" required="required"  value={this.state.paymentInfoCountry} onChange={this.paymentInfoCountryInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="billingZipcode">* Zipcode</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingZipcode" placeholder="Billing Zipcode" required="required"  value={this.state.paymentInfoZipcode} onChange={this.paymentInfoZipcodeInputChange}/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <br/>
                                                <button data-toggle="collapse" data-parent="#accordion"
                                                        className="btn btn-primary pull-right" href="#reviewItems" disabled={this.state.reviewDisabled} onClick={this.goToReview}>Next</button>
                                            </div>
                                        </div>
                                    </Tab>

                                    <Tab style={tableBodyStyle} eventKey="reviewItems" title="Review Items" disabled={this.state.reviewDisabled}>
                                        <div id="reviewItems">
                                            <div className="panel-body">
                                                <h4>Choose your shipping method:</h4>
                                                <div className="radio">
                                                    <label>
                                                        <input type="radio" name="shippingMethod" value="groundShipping" checked={this.state.shippingOption == "groundShipping"} onChange={this.changeShipping}/> Ground
                                                        Shipping
                                                    </label>
                                                    <br/>
                                                    <label>
                                                        <input type="radio" name="shippingMethod" value="premiumShipping" checked={this.state.shippingOption == "premiumShipping"} onChange={this.changeShipping}/> Premium Shipping
                                                    </label>
                                                </div>

                                                <br/>
                                                <h4>Products</h4>
                                                <table className="table table-condensed">
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
                                                    <tr>
                                                        <td className="emptyrow"></td>
                                                        <td className="emptyrow"></td>
                                                        <td className="emptyrow text-center">
                                                            <strong>Tax</strong></td>
                                                        <td className="emptyrow text-right">${Math.round(this.state.totalPrice * 0.08)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="emptyrow"><i
                                                            className="fa fa-barcode iconbig"></i>
                                                        </td>
                                                        <td className="emptyrow"></td>
                                                        <td className="emptyrow text-center">
                                                            <strong>Total</strong></td>
                                                        <td className="emptyrow text-right">${this.state.totalPrice}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>

                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <div style={{marginLeft: "50px"}}>
                                                            <a><h4></h4></a>
                                                            <p hidden
                                                               style={{color: "green"}}>In Stock</p>
                                                            <p hidden
                                                               style={{color: "green"}}>
                                                                Only <span></span>
                                                                In Stock
                                                            </p>
                                                            <p hidden
                                                               style={{color: "darkred"}}>Product Unavailable</p>
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-2" hidden>
                                                        <h5 style={{color: "#db3208", fontSize: "large"}}>
                                                            $<span></span>
                                                        </h5>
                                                    </div>

                                                    <div className="col-xs-2">
                                                        <h5 style={{fontSize: "large"}}></h5>
                                                    </div>

                                                </div>

                                                <hr/>

                                                <button type="submit" className="btn btn-primary btn-block" onClick={this.cartCheckout}>Place
                                                    your order
                                                </button>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>

                                <div style={{color: "red"}} hidden>
                                    <h5 className="alert alert-warning">You don't have enough money in your balance to
                                        complete checkout.</h5>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export {CartCheckout};