import {Component} from 'react';
import AdSense from 'react-adsense';
import Navbar from "react-bootstrap/Navbar";
const Logo = "/images/logo.png"

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{backgroundColor: "#212121"}}>
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3646578755215666" crossOrigin="anonymous"></script>
                <AdSense.Google
                    client='ca-pub-3646578755215666'
                    slot='7259870550'
                    style={{ display: 'block', height: 300, width: 500, backgroundColor: "#212121" }}
                />
                <br/>
                <br/>
                <footer style={{textAlign: "center", color: "#4cbde9", backgroundColor: '#212529'}}>
                    <div>
                        <div style={{display: "inline-block", top: 0, marginRight: '10%'}} className="paddingtop-bottom">
                            <h6 className="heading7">CONTACT</h6>
                            <div className="post">
                                <p>
                                    <i className="fa fa-map-pin"></i> Jaskiniowa 5<br/> 60-115 Poznań, Poland
                                </p>
                                <p>
                                    <i className="fa fa-phone"></i> Phone (PL) : +48 999 999 999
                                </p>
                                <p>
                                    <i className="fa fa-envelope"></i> E-mail : sklep.dropki@gmail.com
                                </p>
                            </div>
                        </div>
                        <div style={{display: "inline-block", top: 0}} className="paddingtop-bottom">
                            <h4>
                                Dropki.pl Book Store. <br/><br/>Serving our customers with the
                                best.
                            </h4>
                            <h6 className="heading7">LINKS</h6>
                            <div className="footer-ul">
                                <div><a href="/contact"> Privacy Policy</a></div>
                            </div>
                        </div>
                        <div style={{display: "inline-block", top: 0, marginLeft: '10%'}} className="paddingtop-bottom">
                            <div className="logofooter">
                                <img
                                    href="/"
                                    src={Logo}
                                    width="140"
                                    height="70"
                                    className="d-inline-block align-top"
                                    alt="React Bootstrap logo"
                                />
                            </div>
                            <br/>
                            <h6 className="heading7">STORE HOURS</h6>
                            <div className="post">
                                <p>Monday - Saturday: 9am - 11pm</p>
                                <p>Sunday: 10am - 10pm</p>
                            </div>
                        </div>
                    </div>
                </footer>
                {/*<div style={{textAlign: "center", color: "#4cbde9"}}><a href="/contact">Privacy policy</a></div>*/}
            </div>
        );
    }
}

export {Footer};
