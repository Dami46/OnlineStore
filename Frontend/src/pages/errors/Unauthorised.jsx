import {Component} from 'react';
import {Link} from "react-router-dom";
import {NavbarTemplate} from '../navbar/NavbarTemplate';
import {Footer} from "../contact/Footer";

class Unauthorised extends Component {

    render() {
        return (
            <div style={{backgroundColor: "#212121", color: "#4cbde9", height: '100vh', minHeight: '100vh'}}>
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
                        <div className="col-md-12 text-center">
                        <span className="display-1">
                            401
                        </span>
                            <div className="mb-4 lead">
                                Unauthorised! Access to this resource is denied.
                            </div>
                            <Link className="btn btn-link" to="/account">
                                Back to Account
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export {Unauthorised};
