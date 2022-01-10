import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import * as imageApi from "../../services/ImageApi";
import {PATH} from "../../services/ConfigurationUrlAService";
import Cookies from 'universal-cookie';
import {Navigate} from "react-router-dom";
import {Button} from "react-bootstrap";

const cookies = new Cookies();

const URLAddress = PATH;

async function timer(that){
    while(true){
        let date = new Date();
        let currentTime = Date.UTC(date.getUTCFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        await new Promise(r => setTimeout(r, 200));
        that.setState({
            currentTime: currentTime
        })
    }
}

function timeLeft(signingDate, currentTime){
    let sign = new Date(signingDate)
    let difference = new Date(sign - currentTime);
    let days = difference.getDate() - 1;
    if(days < 0){
        days = 0;
    }
    let hours = difference.getHours();
    let minutes = difference.getMinutes();
    let seconds = difference.getSeconds();

    return days.toString() + ' days ' + hours.toString() + ' hours ' + minutes.toString() + ' minutes ' + seconds.toString() + ' seconds'
}

class DropDetails extends Component {
    constructor(props) {
        super(props);

        this.signUpOff = this.signUpOff.bind(this);

        this.state = {
            id: window.location.href.split('#')[1],
            bookDetails: {
                id: '',
                author: '',
                bookImage: imageApi.getImageUrl("0"),
                category: '',
                description: '',
                inStockNumber: '',
                language: '',
                listPrice: '',
                numberOfPages: '',
                ourPrice: '',
                publicationDate: '',
                publisher: '',
                title: ''
            },
            dropId: '',
            dropTitle: '',
            rollDate: '',
            signingDate: '',
            userTodropList: '',
            wasRolled: '',
            wasStarted: '',
            currentTime: new Date()
        }

        this.fetchDropDetails()
        timer(this);
    }

    async fetchDropDetails(){
        this.setState({
            dropDetails: {
                id: '',
                author: '',
                dropImage: imageApi.getImageUrl("0"),
                category: '',
                description: '',
                inStockNumber: '',
                language: '',
                listPrice: '',
                numberOfPages: '',
                ourPrice: '',
                publicationDate: '',
                publisher: '',
                title: ''
            },
            dropId: '',
            dropTitle: '',
            rollDate: '',
            signingDate: '',
            userTodropList: '',
            wasRolled: '',
            wasStarted: '',
            dropStarted: false,
            userInDrop: false,
            placeInDrop: 0
        })
        let tok = '';
        if(cookies.get('token') != null){
            tok = cookies.get('token');
        }
        await axios.get(URLAddress + '/api/dropDetail', (tok == '' ? { params: { id: this.state.id } } : { params: {
            id: this.state.id,
            token: tok
        }})).then(dropResp => {
            return dropResp.data;
        }).then(resp => {
            console.log(resp)
            let data = resp.dropItem;
            this.setState({
                bookDetails: {
                    id: data.book.id,
                    author: data.book.author,
                    bookImage: imageApi.getImageUrl(data.book.id),
                    category: data.book.category,
                    description: data.book.description,
                    inStockNumber: data.book.inStockNumber,
                    language: data.book.language,
                    listPrice: data.book.listPrice,
                    numberOfPages: data.book.numberOfPages,
                    ourPrice: data.book.ourPrice,
                    publicationDate: data.book.publicationDate,
                    publisher: data.book.publisher,
                    title: data.book.title
                },
                bookId: data.bookId,
                dropTitle: data.dropTitle,
                id: data.id,
                rollDate: data.rollDate,
                signingDate: data.signingDate,
                userToDropList: data.userToDropList,
                wasRolled: data.wasRolled,
                wasStarted: data.wasStarted,
                dropStarted: resp.dropWasStarted,
                userInDrop: resp.userInDrop,
                placeInDrop: resp.placeInDrop
            })
        });
    }

    async signUpOff(){
        if(cookies.get('token') == null){
            this.setState({
                wantToJoinDrop: true
            })
        }
        await axios.post('/api/signForDrop', {
            dropItemId: this.state.id,
            token: cookies.get('token')
        }).then(resp => {
            if(resp.status == 200){
                this.fetchDropDetails();
            }
        })
    }

    render() {
        if(this.state.wantToJoinDrop) {
            return <Navigate to={{pathname: "/login"}} />
        }

        return (
            <div style={{backgroundColor: "#212121", color: "#4cbde9"}}>
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div>
                    <form method="post" style={{marginLeft: "10%"}}>
                        <div className="row" style={{marginTop: "20px"}}>
                            <div style={{display: 'inline-block'}} className="col-xs-3">
                                <img src={this.state.bookDetails.bookImage}
                                     style={{width: '270px', height: '350px', marginLeft: '35%'}}
                                     className="img-responsive shelf-book"/>
                                     <div style={{display: "inline-block"}}>
                                         <strong style={{color: "#f2575b", width: "300px", marginLeft: "20px", display: "block"}}>
                                             {this.state.wasRolled == true ? "Status: Finished" : this.state.wasStarted == true ? 'Status: Started!' : 'Time left: ' + timeLeft(this.state.signingDate, this.state.currentTime)}
                                         </strong>
                                         <br/>
                                         <Button disabled={this.state.wasStarted == true && this.state.wasRolled == false ? false : true} variant={"success"} className="btn" name="signUp" hidden={this.state.userInDrop} onClick={this.signUpOff}
                                                 style={{
                                                     marginLeft: "20px",
                                                     border: "1px solid",
                                                     padding: "10px 40px 10px 40px"
                                                 }}
                                         >Sign Up</Button>
                                         <Button disabled={this.state.wasStarted == true && this.state.wasRolled == false ? false : true} variant={"danger"} className="btn" name="signOff" hidden={!this.state.userInDrop} onClick={this.signUpOff}
                                                 style={{
                                                     marginLeft: '20px',
                                                     border: "1px solid",
                                                     padding: "10px 40px 10px 40px"
                                                 }}
                                         >Sign Off</Button>
                                     </div>

                            </div>

                            <div style={{display: 'inline-block'}} className="col-xs-9">
                                <h3><span style={{color: "forestgreen"}} hidden><i className="fa fa-check"
                                                                                   aria-hidden="true"
                                                                                   style={{color: "forestgreen"}}></i>Added to cart.</span>
                                </h3>
                                <h3><span style={{color: "red"}}
                                          hidden>Oops, only <span>{this.state.bookDetails.inStockNumber}</span> In Stock.</span>
                                </h3>
                                <h3>{this.state.bookDetails.title}</h3>
                                <div className="row">
                                    <div className="col-xs-5">
                                        <h5><strong>Author: </strong> <span>{this.state.bookDetails.author}</span></h5>
                                        <p><strong>Publisher: </strong> <span>{this.state.bookDetails.publisher}</span></p>
                                        <p><strong>Publication Date: </strong> <span>{this.state.bookDetails.publicationDate}</span>
                                        </p>
                                        <p><strong>Language: </strong> <span>{this.state.bookDetails.language}</span></p>
                                        <p><strong>Category: </strong> <span>{this.state.bookDetails.category}</span></p>
                                        <p><strong>Number of pages: </strong><span>{this.state.bookDetails.numberOfPages}</span></p>
                                        <p style={{width: '60%'}}><strong>Description: </strong>{this.state.bookDetails.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p></p>
                        </div>
                    </form>

                    <div className="col-xs-6" style={{textAlign: 'center'}}>
                        <h4 style={{color: "green"}} hidden> In stock</h4>
                        <h4 style={{color: "green"}} hidden> Only <span> in stock</span></h4>
                        <h4 style={{color: "darkred"}} hidden> Unavailable </h4>
                    </div>
                </div>
            </div>
        );
    }
}

export {DropDetails};
