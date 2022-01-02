import {Component} from 'react';
import {NavbarTemplate} from '../navbar/NavbarTemplate';

class CartPage extends Component {
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

                <h1>Cart Page</h1>
            </div>
        );
    }
}

export {CartPage};
