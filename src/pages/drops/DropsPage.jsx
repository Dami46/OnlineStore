import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";

class DropsPage extends Component {
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
                    <h1>Drops Page</h1>
                </div>
            </div>
        );
    }
}

export {DropsPage};
