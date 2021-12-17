import {Component} from 'react';
import './HomePage.css';
import {Navbar} from '../../navbar/Navbar.jsx';

var Logo = "/images/logo.png"
var Book1 = "/images/book1_example.jpg"
var Book2 = "/images/book2_example.jpg"
var Book3 = "/images/book3_example.jpg"


class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>Home Page
              <img style={{flex: 1, width: 300, height: 150, resizeMode: 'contain'}} src={Logo}/>
              <Navbar/>
          </div>
        );
    }
}

export {HomePage};
