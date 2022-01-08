import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class OrderSubmittedPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return(
            <div>

            </div>
        )
    }
}

export {OrderSubmittedPage};