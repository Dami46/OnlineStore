import {Component} from 'react';
import AdSense from 'react-adsense';

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
                <div style={{textAlign: "center", color: "#4cbde9"}}><a href="/contact">Privacy policy</a></div>
            </div>
        );
    }
}

export {Footer};
