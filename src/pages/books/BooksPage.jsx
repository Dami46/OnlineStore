import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";

class BooksPage extends Component {
    constructor(props) {
        super(props);
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
                                <img class="img-responsive shelf-book"/>
                            </div>

                            <div class="col-xs-9">
                                <h3><span style={{color: "forestgreen"}} hidden><i class="fa fa-check" aria-hidden="true" style={{color: "forestgreen"}}></i>Added to cart.</span></h3>
                                <h3><span style={{color: "red"}} hidden>Oops, only <span></span> In Stock.</span></h3>
                                <h3> Book title</h3>
                                <div class="row">
                                    <div class="col-xs-5">
                                        <h5><strong>Author: </strong> <span> </span></h5>
                                        <p><strong>Publisher: </strong> <span> </span></p>
                                        <p><strong>Publication Date: </strong> <span> </span></p>
                                        <p><strong>Language: </strong> <span> </span></p>
                                        <p><strong>Category: </strong> <span> </span></p>
                                        <p><strong>Number of pages: </strong><span></span> </p>
                                    </div>

                                    <div class="col-xs-7">
                                        <div class="panel panel-default" style={{borderWidth: "5px", marginTop: "20px"}}>
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h4> Price: <span style={{color: "#db3208"}}>$<span></span></span></h4>
                                                        <p>Before Price: <span style={{textDecoration: "line-through"}}>$ <span></span></span></p>
                                                        <p>You save: $<span></span>
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

                                                        <input type="submit" class="btn btn-warning" name="addToCart" value="Add to cart"  style={{color: "black", border: "1px solid", padding: "10px 40px 10px 40px"}}/>

                                                    <br/> <br/>

                                                    <input type="submit" class="btn btn-warning" name="buyBook" value="  Buy book" style={{color: "black", border: "1px solid", padding: "10px 40px 10px 40px"}}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <hr/>
                        <p></p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export {BooksPage};
