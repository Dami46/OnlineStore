import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class BalancePage extends Component {
    constructor(props) {
        super(props);

        this.getBalanceData = this.getBalanceData.bind(this);
        this.askForMoney = this.askForMoney.bind(this);
        this.handleBalanceChange = this.handleBalanceChange.bind(this);

        this.state = {
            requestsCount: 0,
            balance: 0,
            rechargeBalanceAmount: 0,
            newRequestAvailable: true,
            requestAccepted: false,
            requestRejected: false
        }

        this.getBalanceData()
    }

    handleBalanceChange(event){
        this.setState({
            rechargeBalanceAmount: event.target.value
        })
    }

    async getBalanceData(){
        await axios.get('/api/updateUserBalance', { params: {
                token: cookies.get('token')
            }
        })
        .then(response => {
            return response.data;
        }).then(data => {
            console.log(data)
            this.setState({
                requestsCount: data.numberOfRequests,
                newRequestAvailable: !data.tooManyRequests,
                balance: data.user.balance
            })
        })
    }

    async askForMoney(){
        await axios.post('/api/updateUserBalance',  {
            token: cookies.get('token'),
            sumToAdd: this.state.rechargeBalanceAmount
        })
        .then(response => {
            return response.status;
        }).then(status => {
            if(status == 200){
                this.setState({
                    requestAccepted: true
                })
            }
        }).then(() => {
            this.getBalanceData()
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

                <div class="row" style={{marginTop: "60px"}}>
                    <div class="col-xs-9 col-xs-offset-3">

                        <div>
                            <div class="tab-pane">
                                <div class="panel-group">
                                    <div class="panel panel-default" style={{border: "none"}}>
                                        <div class="panel-body" style={{backgroundColor: "#ededed", marginTop: "20px", marginLeft: "20%", width: "60%", textAlign: "center"}}>

                                            <div class="alert alert-success" hidden={!this.state.requestAccepted}>
                                                <strong>Update Success! Wait for admin to accept your request</strong>
                                            </div>

                                            <div className="alert alert-warning" hidden={this.state.newRequestAvailable}>
                                                <strong>Update Failed! Too many requests</strong>
                                            </div>

                                            <div class="alert alert-info">
                                                You have <span>{this.state.requestsCount} </span>
                                                requests pending
                                            </div>

                                            <form id="myForm" method="post">
                                                <input type="hidden" name="id"/>

                                                <div>
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <label for="balance"> Balance </label>
                                                            <span style={{marginTop: '20px'}} type="text" class="form-control" id="balance" name="balance" readonly="readonly">
                                                                {this.state.balance}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <br/>
                                                </div>

                                                <div>
                                                    <label for="sumToAdd"> Recharge your balance </label>
                                                    <input type="number" style={{marginTop: '20px', marginLeft: '20%', width: '60%'}} class="form-control" id="sumToAdd" name="sumToAdd" step="0.01" min="0.00" onChange={this.handleBalanceChange} placeholder="You can add money here"/>
                                                </div>
                                            </form>
                                            <div>
                                                <br/>
                                            </div>
                                            <button type="submit" className="btn btn-success" onClick={this.askForMoney} disabled={!this.state.newRequestAvailable}>
                                                Add balance
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export {BalancePage};
