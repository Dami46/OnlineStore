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
    constructor(props) {
        super(props);
        this.changeUsername = this.changeUsername.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitRegister = this.submitRegister.bind(this);
        this.submitForgetPassword = this.submitForgetPassword.bind(this);

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
        }
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

    async submitLogin(event){
        event.preventDefault();
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
    }

    async submitRegister(event){
        event.preventDefault();
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
    }

    async submitForgetPassword(event){
        event.preventDefault();
        await axios.post(URLAddress + '/api/forgetPassword', {
            email: this.state.email
        }).then(loginResp => {
            if(loginResp.status == 200){
                this.setState({
                    emailNotExist: false,
                    emailForgetPasswordSent: true
                });
            }
        }).catch(err => {
            this.setState({
                emailForgetPasswordSent: false,
                emailNotExist: true
            })
        })
    }



    render() {
        if (this.state.logged) {
            return <Navigate to='/home' />
        }

        return (
            <div style={{backgroundColor: "#212121", height: '100%', minHeight: '100vh'}}>
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <Tabs style={tableHeaderStyle} defaultActiveKey="login" className="mb-3">
                    <Tab style={tableBodyStyle} eventKey="newaccount" title="New account">
                        <div className="tab-pane" id="tab1" style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px"}}>
                            <div className="panel-group">
                                <div className="panel panel-default" style={{border: "none"}}>
                                    <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div className="alert alert-info" hidden={!this.state.emailSent}>
                                            An email has been sent to the email address you just registered.
                                        </div>

                                        <form style={{backgroundColor: "#4c4c4c"}}>
                                            <div className="form-group">
                                                <label htmlFor="newUsername">Username</label><br/>
                                                <span style={{color: "#f2575b"}} hidden={!this.state.userNameAlreadyExist}>Username already exists!</span>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="newUsername" name="username" placeholder={"Enter your username"} onChange={this.changeUsername}/>
                                            </div>

                                            <div style={{marginTop: "10px"}} className="form-group">
                                                <label htmlFor="email">Email Address: </label><br/>
                                                <span style={{color: "#f2575b"}} hidden={!this.state.emailAlreadyExist}>Email already exists!</span>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="email" name="email" placeholder={"Enter your email"} onChange={this.changeEmail}/>
                                            </div>

                                            <button style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px", marginBottom: "10px"}} className="btn" onClick={this.submitRegister}>Create new account</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab style={tableBodyStyle} eventKey="login" title="Log in">
                        <div className="tab-pane" id="tab2" style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px"}}>
                            <div className="panel-group">
                                <div className="panel panel-default " style={{border: "none"}}>
                                    <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div style={{color: "#f2575b"}} hidden={!this.state.invalidCredentials}>
                                            Incorrect username or password
                                        </div>
                                        <form style={{backgroundColor: "#4c4c4c"}}>
                                            <div className="form-group">
                                                <label htmlFor="username">Username</label>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="username" name="username" placeholder={"Enter your username"} onChange={this.changeUsername}/>
                                            </div>

                                            <div style={{marginTop: "10px"}} className="form-group">
                                                <label htmlFor="password">Password: </label>
                                                <input style={inputStyle} required="required" type="password" className="form-control" id="password" name="password" placeholder={"Enter your password"} onChange={this.changePassword}/>
                                            </div>

                                            <button style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px", marginBottom: "10px"}} className="btn" onClick={this.submitLogin}>Log in</button>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab style={tableBodyStyle} eventKey="forgotpassword" title="Forgot password">
                        <div className="tab-pane" id="tab3" style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px"}}>
                            <div className="panel-group">
                                <div className="panel panel-default" style={{border: "none"}}>
                                    <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div className="alert alert-danger" hidden={!this.state.emailNotExist}>
                                            Email doesn't exist
                                        </div>
                                        <div className="alert alert-success" hidden={!this.state.emailForgetPasswordSent}>
                                            Email sent
                                        </div>
                                        <form style={{backgroundColor: "#4c4c4c"}}>
                                            <div className="form-group">
                                                <label htmlFor="recoverEmail">Your Email: </label>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="recoverEmail" name="email" placeholder={"Enter your registered email address here"} onChange={this.changeEmail}/>
                                            </div>

                                            <button style={{backgroundColor: "#212121", color: "#4cbde9", marginTop: "10px", marginBottom: "10px"}} className="btn" onClick={this.submitForgetPassword}>Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                <Footer/>
            </div>
        );
    }
}

export {LoginPage};
