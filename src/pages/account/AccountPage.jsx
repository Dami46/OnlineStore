import {Component, useState} from 'react';
import './AccountPage.css';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import {Tabs} from "react-bootstrap";
import {Tab} from "bootstrap";
import {PATH} from "../../services/ConfigurationUrlAService";
import Cookies from 'universal-cookie';
import axios from "axios";
import {Navigate} from "react-router-dom";

const cookies = new Cookies();

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
    width: "70%",
    marginLeft: "15%",
    textAlign: "center"
}

const inputStyle = {
    width: "70%",
    marginLeft: "15%",
    textAlign: "center"
}

class AccountPage extends Component {
    constructor(props) {
        super(props);

        this.getUserDetails = this.getUserDetails.bind(this);

        this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handlePhoneInputChange = this.handlePhoneInputChange.bind(this);
        this.handleFirstnameInputChange = this.handleFirstnameInputChange.bind(this);
        this.handleLastnameInputChange = this.handleLastnameInputChange.bind(this);
        this.handleCurrentPasswordInputChange = this.handleCurrentPasswordInputChange.bind(this);
        this.handleNewPasswordInputChange = this.handleNewPasswordInputChange.bind(this);
        this.handleNewPasswordConfirmInputChange = this.handleNewPasswordConfirmInputChange.bind(this);

        this.saveChangesClick = this.saveChangesClick.bind(this);
        this.deleteAccountClick = this.deleteAccountClick.bind(this);

        this.handleShippingNameInputChange = this.handleShippingNameInputChange.bind(this);
        this.handleShippingStreetAddressOneInputChange = this.handleShippingStreetAddressOneInputChange.bind(this);
        this.handleShippingStreetAddressTwoInputChange = this.handleShippingStreetAddressTwoInputChange.bind(this);
        this.handleShippingCityInputChange = this.handleShippingCityInputChange.bind(this);
        this.handleShippingStateInputChange = this.handleShippingStateInputChange.bind(this);
        this.handleShippingCountryInputChange = this.handleShippingCountryInputChange.bind(this);
        this.handleShippingZipcodeInputChange = this.handleShippingZipcodeInputChange.bind(this);

        this.saveShippingAddressClick = this.saveShippingAddressClick.bind(this);
        this.getShippingDetails = this.getShippingDetails.bind(this);
        this.editSelected = this.editSelected.bind(this);
        this.updateShippingOpen = this.updateShippingOpen.bind(this);
        this.deleteShipping = this.deleteShipping.bind(this);
        this.chooseDefaultShipping = this.chooseDefaultShipping.bind(this);
        this.updateShippings = this.updateShippings.bind(this);
        this.changeActiveTabShipping = this.changeActiveTabShipping.bind(this);
        this.confirmUpdateShipping = this.confirmUpdateShipping.bind(this);
        this.getOrderDetails = this.getOrderDetails.bind(this);

        this.state = {
            id: '',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            newPassword: '',
            newPasswordConfirm: '',
            phone: '',
            orderList: [],
            orderChosen: '',
            userShippingDefault: '',
            newUserShippingDefault: '',
            userShippingList: [],
            userPaymentList: [],
            balance: 0,
            balanceRequestList: [],
            shoppingCart: [],
            updateSuccess: false,
            incorrectPassword: false,
            changesAllowed: false,
            logged: true,

            shippingName: '',
            shippingStreetAddressOne: '',
            shippingStreetAddressTwo: '',
            shippingCity: '',
            shippingCountry: '',
            shippingState: '',
            shippingZipcode: '',
            saveShippingAllowed: false,
            newAddressSuccess: false,
            activeShippingTab: 'list',
            activeNewShipping: true,
            updateShippingId: '',
            isDefault: ''
        }

        try{
            this.getUserDetails();
        }
        catch (err) {}
    }

    async getUserDetails(){
        this.setState({
            id: '',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            newPassword: '',
            newPasswordConfirm: '',
            phone: '',
        })
        await axios.get(PATH + "/api/myProfile", { params: {
                token: cookies.get('token')
            }
        })
        .then(response => {
            return response.data;
        }).then(res => {
            console.log(res)
            this.setState({
                id: res.user.id,
                username: res.user.username,
                email: res.user.email,
                firstName: res.user.firstName,
                lastName: res.user.lastName,
                password: res.user.password,
                phone: res.user.phone,
                orderList: res.orderList,
                balance: res.user.balance,
                balanceRequestList: res.user.balanceRequestList,
                updateSuccess: false,
                incorrectPassword: false,
                changesAllowed: false
            })
        }).then(async () => {
            await this.getShippingDetails();
        })
    }

    async getShippingDetails(){
        this.setState({
            userShippingDefault: [],
            userShippingList: [],
        })
        await axios.get(PATH + "/api/listOfShippingAddresses", { params: {
                token: cookies.get('token')
            }
        }).then(resp => {
            return resp.data.userShippingList;
        }).then(shippingList => {
            for(let i = 0; i < shippingList.length; i++){
                this.setState({
                    userShippingList: this.state.userShippingList.concat({
                        id: shippingList[i].id,
                        userShippingCity: shippingList[i].userShippingCity,
                        userShippingCountry: shippingList[i].userShippingCountry,
                        userShippingDefault: shippingList[i].userShippingDefault,
                        userShippingName: shippingList[i].userShippingName,
                        userShippingState: shippingList[i].userShippingState,
                        userShippingStreet1: shippingList[i].userShippingStreet1,
                        userShippingStreet2: shippingList[i].userShippingStreet2,
                        userShippingZipcode: shippingList[i].userShippingZipcode,
                    })
                })
                if(shippingList[i].userShippingDefault == true){
                    this.setState({
                        userShippingDefault: shippingList[i].id,
                        newUserShippingDefault: shippingList[i].id,
                    })
                }
            }
        })
    }

    async getOrderDetails(event){
        await axios.get(PATH + "/api/orderDetail", { params: {
            id: this.state.orderChosen,
            token: cookies.get('token')
        }}).then(resp => {
            return resp.data;
        }).then(data => {
            console.log(data)
        })
    }

    handleUsernameInputChange(event){
        this.setState({
            username: event.target.value
        })
    }

    handleEmailInputChange(event){
        this.setState({
            email: event.target.value
        })
    }

    handlePhoneInputChange(event){
        this.setState({
            phone: event.target.value
        })
    }

    handleFirstnameInputChange(event){
        this.setState({
            firstName: event.target.value
        })
    }

    handleLastnameInputChange(event){
        this.setState({
            lastName: event.target.value
        })
    }

    handleCurrentPasswordInputChange(event){
        this.setState({
            password: event.target.value
        }, () => {
            if(this.state.password != ''){
                this.setState({
                    changesAllowed: true
                })
            }
            else{
                this.setState({
                    changesAllowed: false
                })
            }
        })
    }

    handleNewPasswordInputChange(event){
        this.setState({
            newPassword: event.target.value
        })
    }

    handleNewPasswordConfirmInputChange(event){
        this.setState({
            newPasswordConfirm: event.target.value
        })
    }

    async saveChangesClick(){
        let newPasswordToSend = this.state.newPasswordConfirm;
        if(this.state.newPassword != this.state.newPasswordConfirm){
            newPasswordToSend = ''
        }
        console.log(this.state)
        await axios.post(URLAddress + '/api/updateUserInfo', {
            id: this.state.id,
            username: this.state.username,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            phone: this.state.phone,
            newPassword: newPasswordToSend
        }).then(updateResp => {
            console.log(updateResp)
            return updateResp.status;
        }).then(async stat => {
            await this.getUserDetails();
            return stat;
        }).then(status => {
            console.log(status)
            if(status == 200){
                this.setState({
                    updateSuccess: true,
                    incorrectPassword: false
                })
            }
        }).catch(err => {
            console.log(err)
            if(err.response.status == 406){
                this.setState({
                    updateSuccess: false,
                    incorrectPassword: true
                })
            }
        })
    }

    async deleteAccountClick(){
        await axios.post(URLAddress + '/api/removeUser', {
            id: this.state.id,
            password: this.state.password
        }).then(async resp => {
            if(resp.status == 200){
                await this.deleteAccount()
            }
        }).catch(err => {
            this.setState({
                updateSuccess: false,
                incorrectPassword: true
            })
        })
    }

   async deleteAccount(){
        await cookies.remove('isLogged',  { path: '/' })
        await cookies.remove('token',  { path: '/' });
        await this.setState({
            logged: false
        })
    }

    handleShippingNameInputChange(event){
        this.setState({
            shippingName: event.target.value
        })
    }

    handleShippingStreetAddressOneInputChange(event){
        this.setState({
            shippingStreetAddressOne: event.target.value
        })
    }

    handleShippingStreetAddressTwoInputChange(event){
        this.setState({
            shippingStreetAddressTwo: event.target.value
        })
    }

    handleShippingCityInputChange(event){
        this.setState({
            shippingCity: event.target.value
        })
    }

    handleShippingStateInputChange(event){
        this.setState({
            shippingState: event.target.value
        })
    }

    handleShippingCountryInputChange(event){
        this.setState({
            shippingCountry: event.target.value
        })
    }

    handleShippingZipcodeInputChange(event){
        this.setState({
            shippingZipcode: event.target.value
        })
    }

    checkShippingFields(){
        if(this.state.shippingName != '' &
            this.state.shippingStreetAddressOne != '' &&
            this.state.shippingStreetAddressTwo != '' &&
            this.state.shippingCity != '' &&
            this.state.shippingState != '' &&
            this.state.shippingCountry != '' &&
            this.state.shippingZipcode != ''
        ){
            return true;
        }
        else{
            return false;
        }
    }

    async saveShippingAddressClick(){
        if(this.checkShippingFields()){
            await axios.post(URLAddress + '/api/addNewShippingAddress', {
                token: cookies.get('token'),
                userShippingName: this.state.shippingName,
                userShippingStreet1: this.state.shippingStreetAddressOne,
                userShippingStreet2: this.state.shippingStreetAddressTwo,
                userShippingCity: this.state.shippingCity,
                userShippingState: this.state.shippingState,
                userShippingCountry: this.state.shippingCountry,
                userShippingZipcode: this.state.shippingZipcode,
                userShippingDefault: true
            }).then(async resp => {
                if(resp.status == 200){
                    this.setState({
                        newAddressSuccess: true
                    })
                    this.getShippingDetails();
                }
            })
        }
    }

    editSelected(){
        this.setState({
            newAddressSuccess: false
        })
    }

    updateShippingOpen(event){
        this.setState({
            activeShippingTab: 'edit'
        })
        for(let i = 0; i < this.state.userShippingList.length; i++){
            if(event.target.id == this.state.userShippingList[i].id){
                this.setState({
                    updateShippingId: event.target.id,
                    shippingName: this.state.userShippingList[i].userShippingName,
                    shippingStreetAddressOne: this.state.userShippingList[i].userShippingStreet1,
                    shippingStreetAddressTwo: this.state.userShippingList[i].userShippingStreet2,
                    shippingCity: this.state.userShippingList[i].userShippingCity,
                    shippingCountry: this.state.userShippingList[i].userShippingCountry,
                    shippingState: this.state.userShippingList[i].userShippingState,
                    shippingZipcode: this.state.userShippingList[i].userShippingZipcode,
                    activeNewShipping: false,
                    isDefault: this.state.userShippingList[i].userShippingDefault,
                })
            }
        }
    }

    async confirmUpdateShipping(){
        console.log(this.state)
        await axios.put(URLAddress + '/api/updateUserShipping', {
            id: this.state.updateShippingId,
            token: cookies.get('token'),
            userShippingName: this.state.shippingName,
            userShippingStreet1: this.state.shippingStreetAddressOne,
            userShippingStreet2: this.state.shippingStreetAddressTwo,
            userShippingCity: this.state.shippingCity,
            userShippingState: this.state.shippingState,
            userShippingCountry: this.state.shippingCountry,
            userShippingZipcode: this.state.shippingZipcode,
            userShippingDefault: this.state.isDefault
        }).then(async resp => {
            console.log(resp)
            if(resp.status == 200){
                this.setState({
                    activeShippingTab: 'list'
                })
                this.getShippingDetails();
            }
        })
    }

    async deleteShipping(event){
        await axios.delete(URLAddress + '/api/removeUserShipping', { data: {
            token: cookies.get('token'),
            id: event.target.id,
            userShippingDefault: event.target.id == this.state.userShippingDefault
        }}).then(async resp => {
            if(resp.status == 200){
                this.getShippingDetails();
            }
        })
    }

    chooseDefaultShipping(event){
        this.setState({
            newUserShippingDefault: event.target.value
        })
    }

    async updateShippings(){
        await axios.post(URLAddress + '/api/setDefaultShippingAddress', {
            token: cookies.get('token'),
            id: this.state.userShippingDefault,
            userShippingDefault: this.state.userShippingDefault == this.state.newUserShippingDefault
        }).then(async resp => {
            console.log(resp)
            if(resp.status == 200){
                this.getShippingDetails();
            }
        })
    }

    changeActiveTabShipping(key){
        this.setState({
            activeShippingTab: key
        })
        if(this.state.activeShippingTab == 'list'){
            this.setState({
                shippingName: '',
                shippingStreetAddressOne: '',
                shippingStreetAddressTwo: '',
                shippingCity: '',
                shippingCountry: '',
                shippingState: '',
                shippingZipcode: '',
            })
        }
        else{
            this.setState({
                activeNewShipping: true
            })
        }
    }

    render() {
        if(!this.state.logged) {
            return <Navigate to='/home' />
        }

        const shippingList = this.state.userShippingList.map((shipping) =>
            <tr>
                <td><input onClick={this.chooseDefaultShipping} type="radio" name="defaultShippingAddressId" checked={this.state.userShippingDefault == shipping.id} value={shipping.id}/><span></span>
                </td>
                <td style={{fontWeight: shipping.id == this.state.userShippingDefault ? 'bold' : 'normal'}}>{shipping.userShippingStreet1} {shipping.userShippingStreet2} {shipping.userShippingCity} {shipping.userShippingZipcode} {shipping.userShippingState}</td>
                <td><a><i style={{cursor: 'pointer'}} id={shipping.id} className="fa fa-pencil" onClick={this.updateShippingOpen}></i></a>&nbsp;&nbsp;<a><i style={{cursor: 'pointer'}} id={shipping.id} className="fa fa-times" onClick={this.deleteShipping}></i></a></td>
            </tr>
        )

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


                <div>
                    <Tabs style={tableHeaderStyle} defaultActiveKey="edit" className="mb-3">
                        <Tab style={tableBodyStyle} eventKey="edit" title="Edit">
                            <div className="tab-pane" id="tab1">
                                <div className="panel-group">
                                    <div className="panel panel-default" style={{border: "none"}}>
                                        <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>

                                            <div className="alert alert-danger" hidden={!this.state.incorrectPassword}>
                                                <strong>Incorrect Password!</strong> Please enter the correct password for the current user.
                                            </div>

                                            <div className="alert alert-success" hidden={!this.state.updateSuccess}>
                                                <strong>Update Success!</strong>
                                            </div>

                                            <form method="post">
                                                <input type="hidden" name="id"/>
                                                <div className="bg-info" hidden={!this.state.updateSuccess}>
                                                    User info updated
                                                </div>

                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-xs-6">
                                                            <label htmlFor="firstName"> First Name</label>
                                                            <input style={{textAlign: "center"}} type="text" className="form-control" id="firstName" name="firstName" onChange={this.handleFirstnameInputChange} value={this.state.firstName} placeholder="First name"/>
                                                        </div>
                                                        <div className="col-xs-6">
                                                            <label htmlFor="lastName"> Last Name</label>
                                                            <input style={{textAlign: "center"}} type="text" className="form-control" id="lastName" name="lastName" onChange={this.handleLastnameInputChange} value={this.state.lastName} placeholder="Last name"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="userName"> User Name</label>
                                                    <input style={{textAlign: "center"}} type="text" className="form-control" id="userName" name="username" onChange={this.handleUsernameInputChange} value={this.state.username} placeholder="Username"/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="currentPassword">Current Password</label>
                                                    <input style={{textAlign: "center"}} type="password" className="form-control" id="currentPassword" onChange={this.handleCurrentPasswordInputChange} name="password" placeholder="To update account enter current password"/>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="email">Email Adress</label>
                                                    <input style={{textAlign: "center"}} type="text" className="form-control" id="email" name="email" onChange={this.handleEmailInputChange} value={this.state.email} placeholder="Email"/>
                                                </div>
                                                <p style={{color: "#828282"}} hidden>You can't change your email yet.</p>

                                                <div className="form-group">
                                                    <label htmlFor="phone">Phone Number</label>
                                                    <input style={{textAlign: "center"}} type="text" className="form-control" id="phone" name="phone" onChange={this.handlePhoneInputChange} value={this.state.phone} placeholder="Phone number"/>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="txtNewPassword">Password</label>&nbsp;
                                                    <span id="checkPasswordMatch" style={{color: "red"}}></span>
                                                    <input style={{textAlign: "center"}} type="password" className="form-control" id="txtNewPassword" onChange={this.handleNewPasswordInputChange} placeholder="Enter new password here" name="newPassword"/>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="txtConfirmPassword">Confirm Password</label>
                                                    <input style={{textAlign: "center"}} type="password" className="form-control" onChange={this.handleNewPasswordConfirmInputChange} placeholder="Reenter new password to confirm" id="txtConfirmPassword"/>
                                                </div>
                                                <p style={{color: "#828282"}} hidden> To change current password enter the new in both fields</p>
                                            </form>

                                            <div className="form-group" style={{marginTop: '10px'}}>
                                                <button id="updateUserInfoButton" type="submit" className="btn btn-primary" onClick={this.saveChangesClick} disabled={!this.state.changesAllowed}>
                                                    Save All
                                                </button>
                                            </div>

                                            <div className="form-group" style={{marginTop: '10px'}}>
                                                <button className="btn btn-danger btn-xs delete-user" type="submit" value="delete" onClick={this.deleteAccountClick} disabled={!this.state.changesAllowed}>
                                                    <span className="fa fa-times"></span> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab style={tableBodyStyle} eventKey="orders" title="Orders">
                            <div className="tab-pane" id="tab2">
                                <div className="panel-group">
                                    <div className="panel panel-default" style={{border: "none"}}>
                                        <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>
                                            <table className="table table-sm table-inverse">
                                                <thead>
                                                <tr>
                                                    <th>Order Date</th>
                                                    <th>Order Number</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td><a><span></span></a></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                </tbody>
                                            </table>

                                            <div>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <div className="text-center">
                                                            <h2>
                                                                Order Detail for Purchase #<span></span>
                                                            </h2>
                                                        </div>
                                                        <hr/>

                                                        <div className="row">
                                                            <div className="col-xs-4">
                                                                <div className="panel panel-default height">
                                                                    <div className="panel-heading">
                                                                        <strong>Billing Details</strong>
                                                                    </div>
                                                                    <div className="panel-body">
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-4">
                                                                <div className="panel panel-default height">
                                                                    <div className="panel-heading">
                                                                        <strong>Shipping Details</strong>
                                                                    </div>
                                                                    <div className="panel-body">
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                        <span></span><br/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="panel-heading">
                                                            <h3 className="text-center">
                                                                <strong>Order Summary</strong>
                                                            </h3>
                                                        </div>
                                                        <div className="panel-body">
                                                            <div className="table-responsive">
                                                                <table className="table table-condensed">
                                                                    <thead>
                                                                    <tr>
                                                                        <td><strong>Item Name</strong></td>
                                                                        <td className="text-center"><strong>Item Price</strong></td>
                                                                        <td className="text-center"><strong>Item Quantity</strong></td>
                                                                        <td className="text-right">
                                                                            <strong>Total</strong></td>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    <tr>
                                                                        <td></td>
                                                                        <td className="text-center"></td>
                                                                        <td className="text-center"></td>
                                                                        <td className="text-center"></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="highrow"></td>
                                                                        <td className="highrow"></td>
                                                                        <td className="highrow text-center">
                                                                            <strong>Subtotal</strong>
                                                                        </td>
                                                                        <td className="highrow text-right"></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="emptyrow"></td>
                                                                        <td className="emptyrow"></td>
                                                                        <td className="emptyrow text-center">
                                                                            <strong>Tax</strong></td>
                                                                        <td className="emptyrow text-right"></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="emptyrow"><i
                                                                            className="fa fa-barcode iconbig"></i>
                                                                        </td>
                                                                        <td className="emptyrow"></td>
                                                                        <td className="emptyrow text-center">
                                                                            <strong>Total</strong></td>
                                                                        <td className="emptyrow text-right"></td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab style={tableBodyStyle} eventKey="shipping" title="Shipping">
                            <div className="tab-pane" id="tab3">
                                <div className="panel-group">
                                    <div className="panel panel-default" style={{border: "none"}}>
                                        <div className="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px"}}>

                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item active">
                                                    <a>
                                                        List of Shipping Addresses
                                                    </a>
                                                </li>
                                                <li className="breadcrumb-item active">
                                                    <a>
                                                        Add(Update) Shipping Address
                                                    </a>
                                                </li>
                                            </ol>

                                            <div>
                                                <Tabs style={tableHeaderStyle} activeKey={this.state.activeShippingTab} defaultActiveKey="list" className="mb-3" onSelect={this.changeActiveTabShipping}>
                                                    <Tab style={tableBodyStyle} id="list" eventKey="list" title="List">
                                                        <form method="post">
                                                            <table className="table">
                                                                <thead>
                                                                <tr>
                                                                    <th>Default</th>
                                                                    <th>Shipping Address</th>
                                                                    <th>Operations</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {shippingList}
                                                                </tbody>
                                                            </table>
                                                        </form>

                                                        <div>
                                                            <button className="btn btn-primary" type="submit" onClick={this.updateShippings}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </Tab>

                                                    <Tab style={tableBodyStyle} id="edit" eventKey="edit" title="Edit" onSelect={this.editSelected}>
                                                        <div>
                                                            <form method="post">
                                                                <div className="bg-info" hidden>
                                                                    User info updated.
                                                                </div>

                                                                <div className="alert alert-success" hidden={!this.state.newAddressSuccess}>
                                                                    <strong>New Shipping Address Added</strong>
                                                                </div>

                                                                <hr/>
                                                                <div className="form-group">
                                                                    <h4>Shipping Address</h4>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="shippingName">* Name</label>
                                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingName" placeholder="Receiver Name" required="required" value={this.state.shippingName} onChange={this.handleShippingNameInputChange}/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="shippingAddress">* Street Address</label>
                                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingAddress" placeholder="Street Address 1" value={this.state.shippingStreetAddressOne} onChange={this.handleShippingStreetAddressOneInputChange}/>
                                                                    <input style={{textAlign: 'center'}} type="text" className="form-control" placeholder="Street Address 2" value={this.state.shippingStreetAddressTwo} onChange={this.handleShippingStreetAddressTwoInputChange}/>
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-xs-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="shippingCity">* City</label>
                                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingCity" placeholder="Shipping City" required="required" value={this.state.shippingCity} onChange={this.handleShippingCityInputChange}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="shippingState">* State</label>
                                                                            <input style={{textAlign: 'center'}} id="shippingState" className="form-control" placeholder="Shipping State" required="required" value={this.state.shippingState} onChange={this.handleShippingStateInputChange}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="shippingCountry">* Country</label>
                                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingCountry" placeholder="Shipping Country" required="required" value={this.state.shippingCountry} onChange={this.handleShippingCountryInputChange}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="shippingZipcode">* Zipcode</label>
                                                                            <input style={{textAlign: 'center'}} type="text" className="form-control" id="shippingZipcode" placeholder="Shipping Zipcode" required="required" value={this.state.shippingZipcode} onChange={this.handleShippingZipcodeInputChange}/>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <hr/>
                                                            </form>

                                                            <div className="form-group" style={{marginTop: '10px'}}>
                                                                <button style={{textAlign: 'center'}} type="submit" className="btn btn-primary btn-lg" onClick={this.state.activeNewShipping ? this.saveShippingAddressClick : this.confirmUpdateShipping}>
                                                                    Save All
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                </Tabs>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export {AccountPage};