import './App.css';
import {Component, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {HomePage} from "./pages/home/HomePage";
import {BooksPage} from "./pages/books/BooksPage";
import {AccountPage} from "./pages/account/AccountPage";
import {CartPage} from "./pages/shopping/CartPage";
import {NotFound} from "./pages/errors/NotFound";
import {Unauthorised} from "./pages/errors/Unauthorised";
import {ContactPage} from "./pages/contact/ContactPage";
import {DropsPage} from "./pages/drops/DropsPage";
import {LoginPage} from "./pages/account/LoginPage";
import {BalancePage} from "./pages/balance/Balance";
import {DropDetails} from "./pages/drops/DropDetails";
import {Checkout} from "./pages/shopping/Checkout";
import {OrderSubmittedPage} from "./pages/shopping/OrderSubmittedPage";
import {CartCheckout} from "./pages/shopping/CartCheckout";
import {CartOrderSubmittedPage} from "./pages/shopping/CartOrderSubmitted";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            history: createBrowserHistory(),
        }
    }

    render() {
        const {history} = this.state;
        return (
            <Router history={this.state.history}>
                <Routes>
                    <Route exact path="/" element={<HomePage/>}/>
                    <Route exact path="/home" element={<HomePage/>}/>
                    <Route exact path="/books" element={<BooksPage/>}/>
                    <Route exact path="/login" element={<LoginPage/>}/>
                    <Route exact path="/account" element={<AccountPage/>}/>
                    <Route exact path="/shopping" element={<CartPage/>}/>
                    <Route exact path="/checkout" element={<Checkout/>}/>
                    <Route exact path="/cartCheckout" element={<CartCheckout/>}/>
                    <Route exact path="/drops" element={<DropsPage/>}/>
                    <Route exact path="/drop" element={<DropDetails/>}/>
                    <Route exact path="/contact" element={<ContactPage/>}/>
                    <Route exact path="/balance" element={<BalancePage/>}/>
                    <Route exact path="/orderSubmitted" element={<OrderSubmittedPage/>}/>
                    <Route exact path="/cartOrderSubmitted" element={<CartOrderSubmittedPage/>}/>
                    <Route exact path="/404" element={<NotFound/>}/>
                    <Route exact path="/401" element={<Unauthorised/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        );
    }
}

export default App;
