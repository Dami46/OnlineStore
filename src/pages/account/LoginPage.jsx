import {Component} from 'react';
import './AccountPage.css';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import {Tabs} from "react-bootstrap";
import {Tab} from "bootstrap";
import axios from "axios";
import {useNavigate, Navigate} from 'react-router-dom';
import {PATH} from "../../services/ConfigurationUrlAService";

const URLAddress = PATH;

const tableHeaderStyle = {
    fontSize: "25px",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center"
}

const tableBodyStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center"
}

const inputStyle = {
    width: "70%",
    marginLeft: "15%",
    textAlign: "center"
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
        console.log(this.state.username);
    }

    changeEmail(event){
        this.setState({
            email: event.target.value
        })
        console.log(this.state.email);
    }

    changePassword(event){
        this.setState({
            password: event.target.value
        })
        console.log(this.state.password);
    }

    async submitLogin(event){
        event.preventDefault();
        console.log(URLAddress + '/api/login')
        await axios.post(URLAddress + '/api/login', {
            username: this.state.username,
            password: this.state.password
        }).then(loginResp => {
            console.log(loginResp.status)
            if(loginResp.status == 200){
                this.setState({
                    logged: true
                });
            }
        }).catch(err => {
            console.log(err)
            if(err.response.status == 401) {
                this.setState({
                    invalidCredentials: true
                })
            }
        })
        // NavigateToAccount();
    }

    async submitRegister(event){
        event.preventDefault();
        await axios.post(URLAddress + '/api/newAccount', {
            password: this.state.password,
            username: this.state.username
        }).then(loginResp => {
            console.log(loginResp.status)
            if(loginResp.status == 200){
                this.setState({
                    emailSent: true
                });
            }
        }).catch(err => {
            console.log(err)
            if(err.response.status == 403) {
                this.setState({
                    userNameAlreadyExist: true,
                    userEmailAlreadyExist: true
                })
            }
        })
    }

    async submitForgetPassword(event){
        event.preventDefault();
        await axios.post(URLAddress + '/api/forgetPassword', {
            email: this.state.email
        }).then(loginResp => {
            console.log(loginResp.status)
            if(loginResp.status == 200){
                this.setState({
                    emailForgetPasswordSent: true
                });
            }
        }).catch(err => {
            console.log(err)
            this.setState({
                emailNotExist: true
            })
        })
    }



    render() {
        if (this.state.logged) {
            return <Navigate to='/home' />
        }

        return (
            <div>
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
                        <div className="tab-pane" id="tab1">
                            <div className="panel-group">
                                <div className="panel panel-default" style={{border: "none"}}>
                                    <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div className="alert alert-info" hidden={!this.state.emailSent}>
                                            An email has been sent to the email address you just registered.
                                        </div>

                                        <form method="post">
                                            <div className="form-group">
                                                <label htmlFor="newUsername">Username</label><br/>
                                                <span style={{color: "red"}} hidden={!this.state.userNameAlreadyExist}>Username already exists!</span>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="newUsername" name="username" placeholder={"Enter your username"} onChange={this.changeUsername}/>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="email">Email Address: </label><br/>
                                                <span style={{color: "red"}} hidden={!this.state.emailAlreadyExist}>Email already exists!</span>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="email" name="email" placeholder={"Enter your email"} onChange={this.changeEmail}/>
                                            </div>

                                            <button type="submit" className="btn btn-primary" onClick={this.submitRegister}>Create new account</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab style={tableBodyStyle} eventKey="login" title="Log in">
                        <div className="tab-pane" id="tab2">
                            <div className="panel-group">
                                <div className="panel panel-default " style={{border: "none"}}>
                                    <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div style={{color: "red"}} hidden={!this.state.invalidCredentials}>
                                            Incorrect username or password
                                        </div>
                                        <form method="post">
                                            <div className="form-group">
                                                <label htmlFor="username">Username</label>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="username" name="username" placeholder={"Enter your username"} onChange={this.changeUsername}/>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="password">Password: </label>
                                                <input style={inputStyle} required="required" type="password" className="form-control" id="password" name="password" placeholder={"Enter your password"} onChange={this.changePassword}/>
                                            </div>

                                            <button type="submit" className="btn btn-primary" onClick={this.submitLogin}>Log in</button>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab style={tableBodyStyle} eventKey="forgotpassword" title="Forgot password">
                        <div className="tab-pane" id="tab3">
                            <div className="panel-group">
                                <div className="panel panel-default" style={{border: "none"}}>
                                    <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                        <div className="alert alert-danger" hidden={!this.state.emailNotExist}>
                                            Email doesn't exist
                                        </div>
                                        <div className="alert alert-success" hidden={!this.state.emailForgetPasswordSent}>
                                            Email sent
                                        </div>
                                        <form method="post">
                                            <div className="form-group">
                                                <label htmlFor="recoverEmail">Your Email: </label>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="recoverEmail" name="email" placeholder={"Enter your registered email address here"} onChange={this.changeEmail}/>
                                            </div>

                                            <button type="submit" className="btn btn-primary" onClick={this.submitForgetPassword}>Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export {LoginPage};
