import {Component} from 'react';
import {Link} from "react-router-dom";
import {NavbarTemplate} from '../navbar/NavbarTemplate';

class NotFound extends Component {

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
                            404
                        </span>
                            <div className="mb-4 lead">
                                We can't find the page you are looking for.
                            </div>
                            <Link className="btn btn-link" to="/home">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export {NotFound};
