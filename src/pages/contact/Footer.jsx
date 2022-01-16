import {Component} from 'react';
import {PrivacyPolicy} from "../contact/PrivacyPolicy";

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{backgroundColor: "#212121"}}>
                <div style={{textAlign: "center", color: "#e8e8e8"}}><a href="/contact">Privacy policy</a></div>
            </div>
        );
    }
}

export {Footer};
