import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import {Nav, Tabs, Col, Row} from "react-bootstrap";
import {Tab} from "bootstrap";
import axios from "axios";
import Cookies from 'universal-cookie';
import * as imageApi from "../../services/ImageApi";
import {Navigate} from "react-router-dom";
import {Footer} from "../contact/Footer";
import {LoadingScreen} from "../../services/LoadingScreen";

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

class Checkout extends Component {
    constructor(props) {
        super(props);

        this.changeActiveTab = this.changeActiveTab.bind(this);
        this.goToPayment = this.goToPayment.bind(this);
        this.goToReview = this.goToReview.bind(this);

        this.getBookDetails = this.getBookDetails.bind(this);

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
        this.buyBook = this.buyBook.bind(this);
        this.checkShipping = this.checkShipping.bind(this);
        this.checkPayment = this.checkPayment.bind(this);
        this.defaultShipment = this.defaultShipment.bind(this);

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
            product: [],
            quantity: '',
            price: '',
            orderSuccess: false,
            defaultShipping: false,
            defaultShipment:{
                shippingInfoName: '',
                shippingInfoStreet1: '',
                shippingInfoStreet2: '',
                shippingInfoCity: '',
                shippingInfoState: '',
                shippingInfoCountry: '',
                shippingInfoZipcode: '',
            },
            isLoading: true,
            notEnoughStock: false,
        }

        this.getBookDetails()
    }

    async getBookDetails(){
        this.setState({
            isLoading: true,
        })
        cookies.remove('checkout', { path: '/' })
        await axios.get('/api/checkout?id=' + cookies.get('buyBook').bookId + '&token=' + cookies.get('token'))
        .then(async resp =>{
            return resp.data;
        }).then(async data => {
            let book = data.book;
            await this.setState({
                product: book,
                quantity: 1,
                price: book.ourPrice
            })
            if(data.shippingAddress != undefined){
                await this.setState({
                    defaultShipment:{
                        shippingInfoName: data.shippingAddress.shippingAddressName,
                        shippingInfoStreet1: data.shippingAddress.shippingAddressStreet1,
                        shippingInfoStreet2: data.shippingAddress.shippingAddressStreet2,
                        shippingInfoCity: data.shippingAddress.shippingAddressCity,
                        shippingInfoState: data.shippingAddress.shippingAddressState,
                        shippingInfoCountry: data.shippingAddress.shippingAddressCountry,
                        shippingInfoZipcode: data.shippingAddress.shippingAddressZipcode,
                    }
                })
            }
        })
        this.setState({
            isLoading: false,
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
        this.state.shippingInfoZipcode == '' ||
        this.state.shippingInfoName == null ||
        this.state.shippingInfoStreet1 == null ||
        this.state.shippingInfoStreet2 == null ||
        this.state.shippingInfoCity == null ||
        this.state.shippingInfoState == null ||
        this.state.shippingInfoCountry == null ||
        this.state.shippingInfoZipcode == null){
            console.log(this.state)
            this.setState({
                paymentDisabled: true
            })
        }
        else {
            console.log(this.state)
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
            this.state.paymentInfoZipcode == '' ||
            this.state.paymentInfoName == null ||
            this.state.paymentInfoStreet1 == null ||
            this.state.paymentInfoStreet2 == null ||
            this.state.paymentInfoCity == null ||
            this.state.paymentInfoState == null ||
            this.state.paymentInfoCountry == null ||
            this.state.paymentInfoZipcode == null){
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
            aymentInfoStreet2: event.target.value
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

    async samePaymentAndBilling(){
        if(!this.state.samePaymentAndBilling == true){
            await this.setState({
                samePaymentAndBilling: true,
                paymentInfoName: this.state.shippingInfoName,
                paymentInfoStreet1: this.state.shippingInfoStreet1,
                paymentInfoStreet2: this.state.shippingInfoStreet2,
                paymentInfoCity: this.state.shippingInfoCity,
                paymentInfoState: this.state.shippingInfoState,
                paymentInfoCountry: this.state.shippingInfoCountry,
                paymentInfoZipcode: this.state.shippingInfoZipcode,
                // reviewDisabled: false
            })
            await this.checkPayment()
        }
        else{
            await this.setState({
                samePaymentAndBilling: false,
                paymentInfoName: '',
                paymentInfoStreet1: '',
                paymentInfoStreet2: '',
                paymentInfoCity: '',
                paymentInfoState: '',
                paymentInfoCountry: '',
                paymentInfoZipcode: '',
                // reviewDisabled: true
            })
            await this.checkPayment()
        }
        if(this.state.reviewDisabled == null){
            this.setState({
                reviewDisabled: true,
            })
        }
    }

    changeShipping(event){
        this.setState({
            shippingOption: event.target.value
        })
    }

    async buyBook(){
        this.setState({
            isLoading: true,
        })
        await axios.post('/api/checkout', {
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
            bookId: this.state.product.id,
            token: cookies.get('token')
        })
        .then(async resp => {
            if(resp.status == 200){
                this.setState({
                    orderSuccess: true
                })
                cookies.set('checkout', {
                    "bookId": this.state.product.id,
                    "bookAuthor": this.state.product.author,
                    "bookTitle": this.state.product.title,
                    "price": this.state.price + (this.state.shippingOption == "premiumShipping" ? 10 : 5)
                }, { path: '/' })
            }
        })
        .catch(err => {
            this.setState({
                notEnoughStock: true,
            })
        })
        this.setState({
            isLoading: false,
        })
    }

    async defaultShipment(){
        if(!this.state.defaultShipping == true){
            await this.setState({
                defaultShipping: true,
                shippingInfoName: this.state.defaultShipment.shippingInfoName,
                shippingInfoStreet1: this.state.defaultShipment.shippingInfoStreet1,
                shippingInfoStreet2: this.state.defaultShipment.shippingInfoStreet2,
                shippingInfoCity: this.state.defaultShipment.shippingInfoCity,
                shippingInfoState: this.state.defaultShipment.shippingInfoState,
                shippingInfoCountry: this.state.defaultShipment.shippingInfoCountry,
                shippingInfoZipcode: this.state.defaultShipment.shippingInfoZipcode,
                // paymentDisabled: false
            })
            await this.checkShipping()
        }
        else{
            await this.setState({
                defaultShipping: false,
                shippingInfoName: '',
                shippingInfoStreet1: '',
                shippingInfoStreet2: '',
                shippingInfoCity: '',
                shippingInfoState: '',
                shippingInfoCountry: '',
                shippingInfoZipcode: '',
                // paymentDisabled: true
            })
            await this.checkShipping()
        }
        if(this.state.shippingInfoName == null){
            this.setState({
                paymentDisabled: true,
            })
        }

    }

    render() {
        if(this.state.orderSuccess == true){
            return <Navigate to={{pathname: "/orderSubmitted"}} />
        }

        return(
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

                <div hidden={this.state.isLoading} className="container">
                    <div className="row">
                        <div>
                            <h2 className="section-headline">
                                <span>Checkout</span>
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
                                                $<span>{this.state.quantity * this.state.price}</span>
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
                                                <div className="checkbox">
                                                    <label>
                                                        <input style={{textAlign: 'center'}} id="defaultShippingAddress" type="checkbox" name="defaultShipping" onChange={this.defaultShipment}/>
                                                        Default shipping address
                                                    </label>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="shippingName">* Name</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingName" required="required" placeholder="Receiver Name" name="shippingAddressName" value={this.state.shippingInfoName} onChange={this.shippingInfoNameInputChange}/>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="shippingStreet">* Street Address</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingStreet1" required="required" placeholder="Street Address 1" name="shippingAddressStreet1" value={this.state.shippingInfoStreet1} onChange={this.shippingInfoStreet1InputChange}/>
                                                </div>
                                                <div className="form-group">
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingStreet2" placeholder="Street Address 2" name="shippingAddressStreet2" value={this.state.shippingInfoStreet2} onChange={this.shippingInfoStreet2InputChange}/>
                                                </div>

                                                <div className="row">
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingCity">* City</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingCity" placeholder="Shipping City" required="required" value={this.state.shippingInfoCity} onChange={this.shippingInfoCityInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingState">* State</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingState" placeholder="Shipping State" required="required" value={this.state.shippingInfoState} onChange={this.shippingInfoStateInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingCountry">* Country</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingCountry" placeholder="Shipping Country" required="required" value={this.state.shippingInfoCountry} onChange={this.shippingInfoCountryInputChange}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <div className="form-group">
                                                            <label htmlFor="shippingZipcode">* Zipcode</label>
                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingZipcode" placeholder="Shipping Zipcode" required="required" value={this.state.shippingInfoZipcode} onChange={this.shippingInfoZipcodeInputChange}/>
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
                                                        <input style={{textAlign: 'center'}} id="theSameAsShippingAddress" type="checkbox" name="billingSameAsShipping" onChange={this.samePaymentAndBilling}/>
                                                        The same as shipping address
                                                    </label>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="billingName">* Name</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingName" placeholder="Receiver Name" required="required" value={this.state.paymentInfoName} onChange={this.paymentInfoNameInputChange}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="billingAddress">* Street Address</label>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingStreet1" placeholder="Street Address 1" required="required" value={this.state.paymentInfoStreet1} onChange={this.paymentInfoStreet1InputChange}/>
                                                    <input style={{textAlign: 'center'}} type="text" className="form-control billingAddress" id="billingStreet2" placeholder="Street Address 2" value={this.state.paymentInfoStreet2} onChange={this.paymentInfoStreet2InputChange}/>
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
                                        <div style={{textAlign: 'center'}}>
                                            <h2 style={{color: "#f2575b"}} hidden={!this.state.notEnoughStock}> Not Enough In Stock</h2>
                                        </div>
                                        <div id="reviewItems">
                                            <div className="panel-body">
                                                <h4>Choose your shipping method:</h4>
                                                <div className="radio">
                                                    <label>
                                                        <input type="radio" name="shippingMethod" value="groundShipping" checked={this.state.shippingOption == "groundShipping"} onChange={this.changeShipping}/> Ground Shipping ($5)
                                                    </label>
                                                    <br/>
                                                    <label>
                                                        <input type="radio" name="shippingMethod" value="premiumShipping" checked={this.state.shippingOption == "premiumShipping"} onChange={this.changeShipping}/> Premium Shipping ($10)
                                                    </label>
                                                </div>

                                                <br/>

                                                <div className="row">
                                                    <div className="col-xs-8">
                                                        <h4>Products</h4>
                                                        <div>
                                                            <img style={{width: "60px", height: '80px', display: 'inline-block'}} src={imageApi.getImageUrl(this.state.product.id)}/>
                                                            <div style={{display: 'inline-block', marginLeft: '10px'}}>
                                                                <p>
                                                                    {this.state.product.title}
                                                                    <br/>
                                                                    {this.state.product.author}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: '10px'}} className="col-xs-2">
                                                        <h4>Price</h4>
                                                        <p style={{fontWeight: "normal"}}>${this.state.price}</p>
                                                    </div>
                                                    <div style={{marginTop: '10px'}} className="col-xs-2">
                                                        <h4>Quantity</h4>
                                                        <p style={{fontWeight: "normal"}}>{this.state.quantity}</p>
                                                    </div>
                                                    <div style={{marginTop: '10px'}} className="col-xs-2">
                                                        <h4>Total</h4>
                                                        <p style={{fontWeight: "normal"}}>${this.state.price + (this.state.shippingOption == "premiumShipping" ? 10 : 5)}</p>
                                                    </div>
                                                </div>

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

                                                <button className="btn btn-primary btn-block" onClick={this.buyBook}>Place
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
                <Footer/>
            </div>
        )
    }
}

export {Checkout};