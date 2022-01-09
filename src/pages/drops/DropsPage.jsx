import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import * as imageApi from "../../services/ImageApi";
import {Row, Card, Carousel, Form, FormControl, Button, FormSelect, Tabs} from "react-bootstrap";
import {PATH} from "../../services/ConfigurationUrlAService";
import {Link, Navigate} from "react-router-dom";
import {Typeahead} from 'react-bootstrap-typeahead';
import {Tab} from "bootstrap";
import {Component, useState, useEffect} from 'react';
import EllipsisText from "react-ellipsis-text";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const URLAddress = PATH;

class DropsPage extends Component {
    constructor(props) {
        super(props);

        this.handleDropClick = this.handleDropClick.bind(this);
        this.filterDropsClick = this.filterDropsClick.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.searchOptionClick = this.searchOptionClick.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.signUpOff = this.signUpOff.bind(this);
        this.checkIsInDrop = this.checkIsInDrop.bind(this);

        this.state = {
            wantToJoinDrop: false,
            dropsLoaded: false,
            dropChosen: false,
            dropChosenId: '',
            currentPageId: window.location.href.split('#')[1],
            pageCount: 0,
            pages: [],
            drops: [],
            titles: [],
            authors: [],
            categorys: [],
            languages: [],
            publishers: [],
            filterOption: 'title',
            options: [],
            searchInput: '',
            userInDropList: []
        }

        if(this.state.currentPageId == undefined){
            this.setState({
                currentPageId: 1
            })
        }

        this.fetchdrops();
    }

    async fetchdrops(){
        if(this.state.dropsLoaded == false) {
            this.setState({
                dropsLoaded: false,
                dropChosen: false,
                dropChosenId: '',
                currentPageId: window.location.href.split('#')[1],
                pageCount: 0,
                pages: [],
                drops: [],
                titles: [],
                authors: [],
                categorys: [],
                languages: [],
                publishers: [],
                filterOption: 'title',
                options: [],
                searchInput: '',
                drops: [],
                userInDropList: [],
            })
            let tok = '';
            if(cookies.get('token') != null){
                tok = cookies.get('token');
            }
            await axios.get(URLAddress + '/api/drop', (tok == '' ? {} : { params: {
                    token: tok
            }})).then(dropsResp => {
                return dropsResp.data;
            }).then(resp => {
                let data = resp.itemToDropList;
                this.setState({
                    userInDropList: resp.listOfUsersDrops
                })
                if(this.state.drops.length == 0 && data != null) {
                    for(let j = 0; j < data.length; j++){
                        if(j % 20 == 0){
                            this.setState({
                                pageCount: this.state.pageCount + 1,
                                pages: this.state.pages.concat(this.state.pageCount + 1),
                            })
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        axios.get(URLAddress + '/api/bookDetail', { params: { id: data[i].bookId } }).then(bookResp => {
                            return bookResp.data.book;
                        }).then((book) => {
                            this.setState({
                                drops: this.state.drops.concat({
                                    bookDetails: {
                                        id: book.id,
                                        author: book.author,
                                        bookImage: imageApi.getImageUrl(book.id),
                                        category: book.category,
                                        description: book.description,
                                        inStockNumber: book.inStockNumber,
                                        language: book.language,
                                        listPrice: book.listPrice,
                                        numberOfPages: book.numberOfPages,
                                        ourPrice: book.ourPrice,
                                        publicationDate: book.publicationDate,
                                        publisher: book.publisher,
                                        title: book.title
                                    },
                                    bookId: data[i].bookId,
                                    dropTitle: data[i].dropTitle,
                                    id: data[i].id,
                                    rollDate: data[i].rollDate,
                                    signingDate: data[i].signingDate,
                                    userTodropList: data[i].userTodropList,
                                    wasRolled: data[i].wasRolled,
                                    wasStarted: data[i].wasStarted,
                                })
                            })
                        });
                    }
                }
            }, () => {
                console.log(this.state.pages)
            })
        }
    }

    handleDropClick(event){
        let id = event.currentTarget.id
        this.setState({
            dropChosen: true,
            dropChosenId: id
        }, () => {
            console.log(this.state.dropChosenId)
        })
    }

    filterDropsClick(){
        this.fetchdrops().then(() => {
            let filtereddrops = [];
            filtereddrops = this.state.drops.filter((drop) => drop[this.state.filterOption].toLowerCase().includes(this.state.searchInput.toLowerCase()))
            this.setState({
                drops: filtereddrops
            })
        })
    }

    handleFilterChange(event){
        this.setState({
            filterOption: event.target.value,
            options: this.state[event.target.value + "s"]
        }, () => {
            console.log(this.state.filterOption)
            console.log(this.state.options)
        })
    }

    handleSearchInputChange(event){
        this.setState({
            searchInput: event.target.value
        }, () => {
            console.log(this.state.searchInput)
        })

    }

    searchOptionClick(event){
        try {
            this.setState({
                searchInput: event[0].name
            }, () => {
                console.log(this.state.searchInput)
            })
        }
        catch(err) {}
    }

    updatePage(key){
        console.log(key)
        this.fetchdrops().then(() => {
            let filtereddrops = [];
            let fin = key * 20;
            if(this.state.drops.length < fin){
                fin = this.state.drops.length;
            }
            for(let i = (key - 1) * 20; i < fin; i++){
                console.log(i);
                filtereddrops.push(this.state.drops[i]);
            }
            this.setState({
                drops: filtereddrops
            })
        })
    }

    async signUpOff(event){
        if(cookies.get('token') == null){
            this.setState({
                wantToJoinDrop: true
            })
        }
        await axios.post('/api/signForDrop', {
            dropItemId: event.target.id,
            token: cookies.get('token')
        }).then(resp => {
            if(resp.status == 200){
                this.fetchdrops();
            }
        })
    }

    checkIsInDrop(id){
        for(let i = 0; i < this.state.userInDropList.length; i++){
            if(id == this.state.userInDropList[i]){
                return true;
            }
        }
        return false;
    }

    render() {
        const drops = this.state.drops.map((drop) =>
            <Card style={{marginLeft: "4%", marginBottom: "40px", display: "inline-block"}} id={drop.id}>
                <Card.Body>
                    <Card.Img style={{cursor: "pointer"}} onClick={this.handleDropClick} width="200" height="300" variant="top" src={drop.bookDetails.bookImage} onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src=imageApi.getImageUrl("0");
                    }}/>
                    <Card.Title>
                        {drop.title}
                    </Card.Title>
                    <Card.Subtitle>
                        {drop.bookDetails.author}
                        <br/>
                        {drop.bookDetails.publicationDate}
                        <br/>
                        {drop.bookDetails.pageCount}
                    </Card.Subtitle>
                    <Card.Text>
                        <div>
                            <strong style={{color: 'red', display: 'inline-block'}}>{drop.bookDetails.ourPrice}$</strong> <p style={{textDecoration: 'line-through', display: 'inline-block'}}>{drop.bookDetails.listPrice}$</p>
                        </div>
                        <EllipsisText text={drop.bookDetails.description} id={drop.bookDetails.id} onClick={this.handleDropClick} length={"130"} />
                    </Card.Text>
                    <div>
                        <Button style={{cursor: 'pointer'}} hidden={this.checkIsInDrop(drop.id)} id={drop.id} variant={"success"} className="btn" onClick={this.signUpOff}>&nbsp;Sign Up</Button>
                        <br/>
                        <Button style={{cursor: 'pointer'}} hidden={!this.checkIsInDrop(drop.id)} id={drop.id} variant={"danger"} className="btn" onClick={this.signUpOff}>&nbsp;Sign out</Button>
                    </div>
                </Card.Body>
            </Card>
        )

        const pages = this.state.pages.map((page) =>
            <Tab style={{color: this.state.currentPageId == page ? "red" : "blue", textDecoration: "none", textAlign: "center"}} to={{ pathname: "/home#" + page}} eventKey={page} title={page} onClick={this.updatePage}></Tab>
        )

        if (this.state.dropChosen) {
            return <Navigate to={{pathname: "/drop#" + this.state.dropChosenId}} />
        }

        if(this.state.wantToBuyBook) {
            return <Navigate to={{pathname: "/login"}} />
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

                <div>

                    <div>
                        <br/>
                    </div>

                    <div style={{marginLeft: "20%", width: "60%"}}>
                        <Form className="d-flex">
                            <Form.Select style={{ width: "20%"}} onChange={this.handleFilterChange}>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="category">Category</option>
                                <option value="language">Language</option>
                                <option value="publisher">Publisher</option>
                            </Form.Select>
                            <Typeahead
                                style={{width: "70%"}}
                                id="basic-typeahead-single"
                                labelKey="name"
                                className="me-2"
                                onChange={this.searchOptionClick}
                                options={this.state.options}
                                placeholder="Search"
                            />
                            <Button variant="primary" onClick={this.filterDropsClick}>Search</Button>
                        </Form>
                        <br/>
                    </div>

                    <Tabs style={{alignItems: "center", justifyContent: "center"}} defaultActiveKey="1" className="mb-3" onSelect={this.updatePage}>
                        {pages}
                    </Tabs>

                    <div style={{height: "300px", marginTop: "50px"}}>
                        <Row style={{textAlign: "center", alignItems: "center"}} xs={5}>
                            {drops}
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export {DropsPage};
