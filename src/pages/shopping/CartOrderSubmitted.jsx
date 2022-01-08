import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class CartOrderSubmittedPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookId: '',
            bookImage: '',
            bookTitle: '',
            bookPrice: ''
        }
    }

    render() {
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

                            <input hidden="hidden"/>
                        </div>

                        <h3>Item</h3>
                        <div className="row">
                            <hr/>
                            <div></div>
                            <div>

                                <a> <img
                                    className="img-responsive shelf-book"
                                    style={{width: "70px"}}/>
                                </a>
                            </div>
                            <div>
                                <div style={{marginLeft: "50px"}}>
                                    <a><h4></h4></a>
                                </div>
                            </div>

                            <div>
                                <h5 style={{color: "#db3208", fontSize: "large"}}>
                                    $<span></span>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export {CartOrderSubmittedPage};