import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";

class BalancePage extends Component {
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
                    <h1>Balance Page</h1>
                </div>
            </div>
        );
    }
}

export {BalancePage};
