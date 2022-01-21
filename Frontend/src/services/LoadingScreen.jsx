import {Component} from 'react';
import './LoadingScreen.css';
import {Spinner} from "react-bootstrap";

class LoadingScreen extends Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div className={"loader-wrapper"}>
                <Spinner style={{width: '200px', height: '200px'}} animation="border" variant="primary" />
            </div>
        );
    }
}

export {LoadingScreen};