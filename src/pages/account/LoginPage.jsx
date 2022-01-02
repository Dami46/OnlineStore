import {Component} from 'react';
import './AccountPage.css';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import {Tabs} from "react-bootstrap";
import {Tab} from "bootstrap";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

const URLAddress = 'http://localhost:8080';

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

function NavigateToAccount(){
    let navigate = useNavigate();
    // navigate("../home", { replace: true });
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
            password: ''
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
            email: this.state.email,
            username: this.state.username
        }).then(loginResp => {
            console.log(loginResp.status)
            if(loginResp.status == 200){

            }
        })
        NavigateToAccount();
    }

    async submitRegister(event){
        event.preventDefault();
        await axios.post(URLAddress + '/api/newAccount', {
            password: this.state.password,
            username: this.state.username
        }).then(loginResp => {
            console.log(loginResp.status)
        })
    }

    async submitForgetPassword(event){
        event.preventDefault();
        await axios.post(URLAddress + '/api/forgetPassword', {
            email: this.state.email
        }).then(loginResp => {
            console.log(loginResp.status)
        })
    }



    render() {
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
                                        <div className="alert alert-info" hidden={true}>
                                            An email has been sent to the email address you just registered.
                                        </div>

                                        <form method="post">
                                            <div className="form-group">
                                                <label htmlFor="newUsername">Username</label>
                                                <span style={{color: "red"}} hidden={true}>Username already exists!</span>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="newUsername" name="username" placeholder={"Enter your username"} onChange={this.changeUsername}/>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="email">Email Address: </label>
                                                <span style={{color: "red"}} hidden={true}>Email already exists!</span>
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
                                        <div style={{color: "red"}} hidden={true}>
                                            Incorrect username or password.
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
                                        <div className="alert alert-danger" hidden={true}>
                                            Email doesn't exist.
                                        </div>
                                        <div className="alert alert-success" hidden={true}>
                                            Email sent.
                                        </div>
                                        <form method="post">
                                            <div className="form-group">
                                                <label htmlFor="recoverEmail">Your Email: </label>
                                                <input style={inputStyle} required="required" type="text" className="form-control" id="recoverEmail" name="email" placeholder={"Enter your registered email address here."} onChange={this.changeEmail}/>
                                            </div>

                                            <button type="submit" className="btn btn-primary" onClick={this.submitForgetPassword}>Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>

                {/*<div class="col-xs-9 col-xs-offset-3">*/}
                {/*    <ul className="nav nav-tabs" style={{alignItems: "center", justifyContent: "center"}}>*/}
                {/*        <button variant="primary"><a href="#newaccount" activeClassName="active" data-toggle="tab"><span>Create new account</span></a>*/}
                {/*        </button>*/}
                {/*        &nbsp;*/}
                {/*        <button variant="primary"><a href="#lggin" activeClassName="active" data-toggle="tab"><span>Log in</span></a>*/}
                {/*        </button>*/}
                {/*        &nbsp;*/}
                {/*        <button variant="primary"><a href="#forgetpassword" activeClassName="active" data-toggle="tab"><span>Forget Password</span></a>*/}
                {/*        </button>*/}
                {/*    </ul>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export {LoginPage};
