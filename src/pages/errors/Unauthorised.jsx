import {Component} from 'react';
import {Link} from "react-router-dom";
import {NavbarTemplate} from '../navbar/NavbarTemplate';

class Unauthorised extends Component {

    render() {
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
            </div>
        );
    }
}

export {Unauthorised};
