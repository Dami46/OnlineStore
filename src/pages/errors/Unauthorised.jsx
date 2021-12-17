import {Component} from 'react';
import {Link} from "react-router-dom";

class Unauthorised extends Component {

    render() {
        return (
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
        );
    }
}

export {Unauthorised};
