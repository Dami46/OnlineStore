import {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'universal-cookie';
import {
    loadCaptchaEnginge,
    LoadCanvasTemplate,
    validateCaptcha
} from "react-simple-captcha";

const cookies = new Cookies();

class Captcha extends Component {
    componentDidMount() {
        loadCaptchaEnginge(6, "#212121", "#4cbde9");
    }

    doSubmit = () => {
        let user_captcha = document.getElementById("user_captcha_input").value;
        cookies.remove('captcha', { path: '/' })
        if (validateCaptcha(user_captcha) == true) {
            loadCaptchaEnginge(6, "#212121", "#4cbde9");
            document.getElementById("user_captcha_input").value = "";
            cookies.set('captcha', 'success', { path: '/' })
        } else {
            document.getElementById("user_captcha_input").value = "";
            cookies.set('captcha', 'failure', { path: '/' })
        }
        console.log(cookies.get('captcha'))
    };

    render() {
        return (
            <div>
                <div className="container">
                    <div className="form-group">
                        <div className="col mt-3">
                            <LoadCanvasTemplate reloadColor="#4cbde9" />
                        </div>

                        <div className="col mt-3">
                            <div>
                                <input
                                    placeholder="Enter Captcha"
                                    id="user_captcha_input"
                                    name="user_captcha_input"
                                    type="text"
                                    style={{textAlign: "center", backgroundColor: "#212121", color: "#4cbde9"}}
                                ></input>
                            </div>
                        </div>

                        <div className="col mt-3">
                            <div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.doSubmit()}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export {Captcha};
