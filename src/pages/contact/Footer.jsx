import {Component} from 'react';
import {PrivacyPolicy} from "../contact/PrivacyPolicy";

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{backgroundColor: "#212121", marginTop: '50px'}}>
                <div style={{textAlign: "center", color: "#4cbde9"}}><a href="/contact">Privacy policy</a></div>
            </div>
        );
    }
}

export {Footer};
