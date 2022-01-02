import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";

class ContactPage extends Component {
    constructor(props) {
        super(props);
    }

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

                <div>
                    <h1>Contact Page</h1>
                </div>
            </div>
        );
    }
}

export {ContactPage};
