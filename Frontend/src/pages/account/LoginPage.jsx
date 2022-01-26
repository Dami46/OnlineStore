import {Component} from 'react';
import './AccountPage.css';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import {Tabs} from "react-bootstrap";
import {Tab} from "bootstrap";
import axios from "axios";
import {useNavigate, Navigate} from 'react-router-dom';
import {PATH} from "../../services/ConfigurationUrlAService";
import Cookies from 'universal-cookie';
import {Footer} from "../contact/Footer";
import {LoadingScreen} from "../../services/LoadingScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    LoadCanvasTemplate,
    validateCaptcha,
    loadCaptchaEnginge
} from "react-simple-captcha";

const cookies = new Cookies();

const URLAddress = PATH;

const tableHeaderStyle = {
    fontSize: "25px",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#212121"
}

const tableBodyStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#212121"
}

const inputStyle = {
    width: "70%",
    marginLeft: "15%",
    textAlign: "center",
    color: "#4cbde9",
    backgroundColor: "#212121",
    marginTop: "10px"
}

class LoginPage extends Component {
    constructor() {
        super();

        this.changeUsername = this.changeUsername.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitRegister = this.submitRegister.bind(this);
        this.submitForgetPassword = this.submitForgetPassword.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
        this.loginClicked = this.loginClicked.bind(this);
        this.changeActiveTabs = this.changeActiveTabs.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            logged: false,
            invalidCredentials: false,
            emailSent: false,
            userNameAlreadyExist: false,
            emailAlreadyExist: false,
            emailForgetPasswordSent: false,
            emailNotExist: false,
            isLoading: false,
            captchaVisible: false,
            operation: '',
        }
    }

    changeActiveTabs(){
        this.setState({
            captchaVisible: false
        })
    }

    changeUsername(event){
        this.setState({
            username: event.target.value
        })
    }

    changeEmail(event){
        this.setState({
            email: event.target.value
        })
    }

    changePassword(event){
        this.setState({
            password: event.target.value
        })
    }

    loginClicked(event){
        event.preventDefault();
        this.setState({
            captchaVisible: true,
            operation: 'login'
        })
    }

    async submitLogin(){
        this.setState({
            isLoading: true,
        })
        await axios.post(URLAddress + '/api/login', {
            username: this.state.username,
            password: this.state.password
        }).then(loginResp => {
            if(loginResp.status == 200){
                this.setState({
                    logged: true,
                    invalidCredentials: false
                });
                cookies.set('isLogged', true, { path: '/' });
                cookies.set('token', loginResp.data.token, { path: '/' });
            }
        }).catch(err => {
            if(err.response.status == 401) {
                this.setState({
                    logged: false,
                    invalidCredentials: true
                })
            }
        })
        this.setState({
            isLoading: false,
            captchaVisible: false
        })
    }

    registerClicked(event){
        event.preventDefault();
        this.setState({
            captchaVisible: true,
            operation: 'register'
        })
    }

    async submitRegister(){
        this.setState({
            isLoading: true,
        })
        await axios.post(URLAddress + '/api/newAccount', {
            email: this.state.email,
            username: this.state.username
        }).then(loginResp => {
            if(loginResp.status == 200){
                this.setState({
                    userNameAlreadyExist: false,
                    userEmailAlreadyExist: false,
                    emailSent: true
                });
            }
        }).catch(err => {
            if(err.response.status == 403) {
                if(err.response.data.userNameExists == true){
                    this.setState({
                        emailSent: false,
                        userNameAlreadyExist: true
                    });
                }
                else if(err.response.data.emailExists == true){
                    this.setState({
                        emailSent: false,
                        emailAlreadyExist: true
                    })
                }

            }
        })
        this.setState({
            isLoading: false,
            captchaVisible: false
        })
    }

    async submitForgetPassword(event){
        event.preventDefault();
        this.setState({
            isLoading: true,
        })
        await axios.post(URLAddress + '/api/forgetPassword', {
            email: this.state.email
        }).then(loginResp => {
            if(loginResp.status == 200){
                this.setState({
                    emailNotExist: false,
                    emailForgetPasswordSent: true,
                });
            }
        }).catch(err => {
            this.setState({
                emailForgetPasswordSent: false,
                emailNotExist: true
            })
        })
        this.setState({
            isLoading: false,
        })
    }

    componentDidMount() {
        loadCaptchaEnginge(6, "#212121", "#4cbde9");
    }

    doSubmit = () => {
        let user_captcha = document.getElementById("user_captcha_input").value;
        cookies.remove('captcha', { path: '/' })
        if (validateCaptcha(user_captcha) == true) {
            loadCaptchaEnginge(6, "#212121", "#4cbde9");
            document.getElementById("user_captcha_input").value = "";
            if(this.state.operation == 'register'){
                this.submitRegister()
            }
            else{
                this.submitLogin()
            }
        } else {
            document.getElementById("user_captcha_input").value = "";
            alert('Invalid Captcha')
        }
    };


    render() {
        if (this.state.logged) {
            return <Navigate to='/home' />
        }

        const captcha =
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

        return (
            <div style={{backgroundColor: "#212121", height: '100%', minHeight: '100vh'}}>
                {this.state.isLoading && <LoadingScreen/>}
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <Tabs style={tableHeaderStyle} defaultActiveKey="login" onSelect={this.changeActiveTabs}>
                    <Tab style={tableBodyStyle} eventKey="newaccount" title="New account">
                        <div id="tab1" style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px"}}>
                            <div>
                                <div style={{border: "none"}}>
                                    <div style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div className="alert alert-info" hidden={!this.state.emailSent}>
                                            An email has been sent to the email address you just registered.
                                        </div>

                                        <div style={{backgroundColor: "#4c4c4c"}}>
                                            <div className="form-group">
                                                <label>Username:</label><br/>
                                                <span style={{color: "#f2575b"}} hidden={!this.state.userNameAlreadyExist}>Username already exists!</span>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="newUsername" name="username" placeholder={"Enter your username"} onChange={this.changeUsername}/>
                                            </div>

                                            <div style={{marginTop: "10px"}} className="form-group">
                                                <label>Email Address: </label><br/>
                                                <span style={{color: "#f2575b"}} hidden={!this.state.emailAlreadyExist}>Email already exists!</span>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="email" name="email" placeholder={"Enter your email"} onChange={this.changeEmail}/>
                                            </div>

                                            <button style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px", marginBottom: "10px"}} className="btn" onClick={this.registerClicked}>Create new account</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab style={tableBodyStyle} eventKey="login" title="Log in">
                        <div id="tab2" style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px"}}>
                            <div>
                                <div style={{border: "none"}}>
                                    <div style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div style={{color: "#f2575b"}} hidden={!this.state.invalidCredentials}>
                                            Incorrect username or password
                                        </div>
                                        <div style={{backgroundColor: "#4c4c4c"}}>
                                            <div className="form-group">
                                                <label>Username</label>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="username" name="username" placeholder={"Enter your username"} onChange={this.changeUsername}/>
                                            </div>

                                            <div style={{marginTop: "10px"}} className="form-group">
                                                <label>Password: </label>
                                                <input style={inputStyle} required="required" type="password" className="form-control" id="password" name="password" placeholder={"Enter your password"} onChange={this.changePassword}/>
                                            </div>

                                            <button style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px", marginBottom: "10px"}} className="btn" onClick={this.loginClicked}>Log in</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab style={tableBodyStyle} eventKey="forgotpassword" title="Forgot password">
                        <div id="tab3" style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px"}}>
                            <div>
                                <div style={{border: "none"}}>
                                    <div style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div className="alert alert-danger" hidden={!this.state.emailNotExist}>
                                            Email doesn't exist
                                        </div>
                                        <div className="alert alert-success" hidden={!this.state.emailForgetPasswordSent}>
                                            Email sent
                                        </div>
                                        <div style={{backgroundColor: "#4c4c4c"}}>
                                            <div className="form-group">
                                                <label>Your Email: </label>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="recoverEmail" name="email" placeholder={"Enter your registered email address here"} onChange={this.changeEmail}/>
                                            </div>

                                            <button style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px", marginBottom: "10px"}} className="btn" onClick={this.submitForgetPassword}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                <div style={{textAlign: "center"}} hidden={!this.state.captchaVisible}>
                    {captcha}
                    <br/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export {LoginPage};
