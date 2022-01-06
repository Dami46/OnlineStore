import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import * as imageApi from "../../services/ImageApi";
import {PATH} from "../../services/ConfigurationUrlAService";

const URLAddress = PATH;

class BooksPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: window.location.href.split('#')[1],
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
            title: '',
            quantity: []
        }

        this.fetchBookDetails = this.fetchBookDetails.bind(this)

        this.fetchBookDetails()
    }

    async fetchBookDetails(){
            this.setState({
                bookChosen: false,
                bookChosenId: '',
                books: [],
                authors: [],
                categories: [],
                languages: [],
                publishers: [],
                quantity: []
            })
            await axios.get(URLAddress + '/api/bookDetail', { params: { id: this.state.id } }).then(bookResp => {
                return bookResp.data.book;
            }).then(data => {
                console.log(data)
                this.setState({
                    id: data.id,
                    author: data.author,
                    bookImage: imageApi.getImageUrl(data.id),
                    category: data.category,
                    description: data.description,
                    inStockNumber: data.inStockNumber,
                    language: data.language,
                    listPrice: data.listPrice,
                    numberOfPages: data.numberOfPages,
                    ourPrice: data.ourPrice,
                    publicationDate: data.publicationDate,
                    publisher: data.publisher,
                    title: data.title
                })
                for(let i = 0; i <= data.inStockNumber; i++){
                    this.setState({
                        quantity: this.state.quantity.concat(i)
                    })
                }
            });
    }


    render() {
        const quantity = this.state.quantity.map((numb) =>
            <option value={numb}>{numb}</option>
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
                    <form method="post" style={{marginLeft: "10%"}}>
                        <input hidden="hidden"/>
                        <div class="row" style={{marginTop: "20px"}}>
                            <div style={{}} class="col-xs-3">
                                <img src={this.state.bookImage} style={{width: '200px', height: '300px'}} class="img-responsive shelf-book"/>
                            </div>

                            <div style={{}} class="col-xs-9">
                                <h3><span style={{color: "forestgreen"}} hidden><i class="fa fa-check" aria-hidden="true" style={{color: "forestgreen"}}></i>Added to cart.</span></h3>
                                <h3><span style={{color: "red"}} hidden>Oops, only <span>{this.state.inStockNumber}</span> In Stock.</span></h3>
                                <h3>{this.state.title}</h3>
                                <div class="row">
                                    <div class="col-xs-5">
                                        <h5><strong>Author: </strong> <span>{this.state.author}</span></h5>
                                        <p><strong>Publisher: </strong> <span>{this.state.publisher}</span></p>
                                        <p><strong>Publication Date: </strong> <span>{this.state.publicationDate}</span></p>
                                        <p><strong>Language: </strong> <span>{this.state.language}</span></p>
                                        <p><strong>Category: </strong> <span>{this.state.category}</span></p>
                                        <p><strong>Number of pages: </strong><span>{this.state.numberOfPages}</span> </p>
                                    </div>

                                    <div class="col-xs-7">
                                        <div class="panel panel-default" style={{borderWidth: "5px", marginTop: "20px"}}>
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h4> Price: <span style={{color: "#db3208"}}>$<span>{this.state.ourPrice}</span></span></h4>
                                                        <p>Before Price: <span style={{textDecoration: "line-through"}}>$<span>{this.state.listPrice}</span></span></p>
                                                        <p>You save: $<span>{this.state.ourPrice - this.state.listPrice}</span>
                                                        </p>
                                                        <span>Quantity: </span>
                                                        <select name="qty">
                                                            {quantity}
                                                        </select>
                                                        <br/> <br/>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <h4 style={{color: "green"}} hidden> In stock</h4>
                                                        <h4 style={{color: "green"}} hidden> Only <span> in stock</span></h4>
                                                        <h4 style={{color: "darkred"}} hidden> Unavailable </h4>

                                                        <input type="submit" class="btn btn-warning" name="addToCart" value="Add to cart" style={{color: "black", border: "1px solid", padding: "10px 40px 10px 40px"}}/>

                                                    <br/> <br/>

                                                    <input type="submit" class="btn btn-warning" name="buyBook" value="  Buy book" style={{color: "black", border: "1px solid", padding: "10px 40px 10px 40px"}}/>
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

export {BooksPage};
