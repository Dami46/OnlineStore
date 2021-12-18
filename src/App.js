import './App.css';
import {Component} from 'react';
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
                    <Route exact path="/account" element={<AccountPage/>}/>
                    <Route exact path="/shopping" element={<CartPage/>}/>
                    <Route exact path="/drops" element={<DropsPage/>}/>
                    <Route exact path="/contact" element={<ContactPage/>}/>
                    <Route exact path="/404" element={<NotFound/>}/>
                    <Route exact path="/401" element={<Unauthorised/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        );
    }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>Welcome in Online Store</p>
//       </header>
//     </div>
//   );
// }

export default App;
