import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import * as imageApi from "../../services/ImageApi";
import {PATH} from "../../services/ConfigurationUrlAService";

const URLAddress = PATH;

class DropDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: window.location.href.split('#')[1],
            bookDetails: {
                id: '',
                author: '',
                bookImage: '',
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
            wasStarted: ''
        }

        this.fetchDropDetails()
    }

    async fetchDropDetails(){
        this.setState({
            dropDetails: {
                id: '',
                author: '',
                dropImage: '',
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
            wasStarted: ''
        })
        console.log(this.state.id)
        await axios.get(URLAddress + '/api/dropDetail', { params: { id: this.state.id } }).then(dropResp => {
            return dropResp.data.dropItem;
        }).then(data => {
            console.log(data)
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
                userTodropList: data.userTodropList,
                wasRolled: data.wasRolled,
                wasStarted: data.wasStarted
            })
        });
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

                <div>
                    <form method="post" style={{marginLeft: "10%"}}>
                        <input hidden="hidden"/>
                        <div class="row" style={{marginTop: "20px"}}>
                            <div class="col-xs-3">
                                <img src={this.state.bookDetails.bookImage} class="img-responsive shelf-drop"/>
                            </div>

                            <div class="col-xs-9">
                                <h3><span style={{color: "forestgreen"}} hidden><i class="fa fa-check" aria-hidden="true" style={{color: "forestgreen"}}></i>Added to cart.</span></h3>
                                <h3><span style={{color: "red"}} hidden>Oops, only <span>{this.state.bookDetails.inStockNumber}</span> In Stock.</span></h3>
                                <h3>{this.state.dropTitle}</h3>
                                <div class="row">
                                    <div class="col-xs-5">
                                        <h5><strong>Author: </strong> <span>{this.state.bookDetails.author}</span></h5>
                                        <p><strong>Publisher: </strong> <span>{this.state.bookDetails.publisher}</span></p>
                                        <p><strong>Publication Date: </strong> <span>{this.state.bookDetails.publicationDate}</span></p>
                                        <p><strong>Language: </strong> <span>{this.state.bookDetails.language}</span></p>
                                        <p><strong>Category: </strong> <span>{this.state.bookDetails.category}</span></p>
                                        <p><strong>Number of pages: </strong><span>{this.state.bookDetails.numberOfPages}</span> </p>
                                    </div>

                                    <div class="col-xs-7">
                                        <div class="panel panel-default" style={{borderWidth: "5px", marginTop: "20px"}}>
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h4> Price: <span style={{color: "#db3208"}}>$<span>{this.state.bookDetails.ourPrice}</span></span></h4>
                                                        <p>Before Price: <span style={{textDecoration: "line-through"}}>$<span>{this.state.bookDetails.listPrice}</span></span></p>
                                                        <p>You save: $<span>{this.state.bookDetails.ourPrice - this.state.bookDetails.listPrice}</span>
                                                        </p>
                                                        <span>Quantity: </span>
                                                        <select name="qty">
                                                            <option></option>
                                                        </select>
                                                        <br/> <br/>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <h4 style={{color: "green"}} hidden> In stock</h4>
                                                        <h4 style={{color: "green"}} hidden> Only <span> in stock</span></h4>
                                                        <h4 style={{color: "darkred"}} hidden> Unavailable </h4>

                                                        <input type="submit" class="btn btn-warning" name="addToCart" value="Add to cart" style={{color: "black", border: "1px solid", padding: "10px 40px 10px 40px"}}/>

                                                        <br/> <br/>

                                                        <input type="submit" class="btn btn-warning" name="buydrop" value="  Buy drop" style={{color: "black", border: "1px solid", padding: "10px 40px 10px 40px"}}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p></p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export {DropDetails};
