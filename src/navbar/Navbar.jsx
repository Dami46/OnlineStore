import {Component} from 'react';
import {MenuItems} from "./MenuItems";

class Navbar extends Component {
    render() {
        return (
            <nav className="NavbarItems">
                <ul>
                    {MenuItems.map((item, index) => {
                        return (
                            <li>
                                <a className={item.cName} href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }
}

export {Navbar};
