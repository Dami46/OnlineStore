import {NavbarTemplate} from "../navbar/NavbarTemplate";
import axios from "axios";
import * as imageApi from "../../services/ImageApi";
import {Row, Card, Form, Button, Tabs} from "react-bootstrap";
import {PATH} from "../../services/ConfigurationUrlAService";
import {Navigate} from "react-router-dom";
import {Typeahead} from 'react-bootstrap-typeahead';
import {Tab} from "bootstrap";
import {Component} from 'react';
import EllipsisText from "react-ellipsis-text";
import Cookies from 'universal-cookie';
import {Footer} from "../contact/Footer";
import {LoadingScreen} from "../../services/LoadingScreen";
import {Captcha} from '../../services/Captcha';

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

class DropsPage extends Component {
    constructor(props) {
        super(props);

        this.handleDropClick = this.handleDropClick.bind(this);
        this.filterDropsClick = this.filterDropsClick.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.searchOptionClick = this.searchOptionClick.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.joinDrop = this.joinDrop.bind(this);
        this.signUpOff = this.signUpOff.bind(this);
        this.checkIsInDrop = this.checkIsInDrop.bind(this);
        this.sortAsc = this.sortAsc.bind(this);
        this.sortDsc = this.sortDsc.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.sortBooks = this.sortBooks.bind(this);

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
            prices: [],
            publicationDates: [],
            sortingOption: 'title',
            sortingOrder: 'asc',
            filterOption: 'title',
            options: [],
            searchInput: '',
            userTodropList: [],
            currentTime: new Date(),
            isLoading: true,
            dropsCaptchas: {}
        }

        if(this.state.currentPageId == undefined){
            this.setState({
                currentPageId: 1
            })
        }

        this.fetchdrops();
        timer(this);
    }

    async fetchdrops(){
        this.setState({
            isLoading: true,
        })
        if(this.state.dropsLoaded == false) {
            this.setState({
                dropsLoaded: false,
                dropChosen: false,
                dropChosenId: '',
                currentPageId: window.location.href.split('#')[1],
                pageCount: 0,
                pages: [],
                titles: [],
                authors: [],
                categorys: [],
                languages: [],
                publishers: [],
                filterOption: 'title',
                options: [],
                searchInput: '',
                drops: [],
                userTodropList: [],
                dropsCaptchas: {}
            })
            let tok = '';
            if(cookies.get('token') != null){
                tok = cookies.get('token');
            }
            await axios.get(URLAddress + '/api/drop', (tok == '' ? {} : { params: {
                token: tok
            }})).then(dropsResp => {
                return dropsResp.data;
            }).then(async resp => {
                console.log(resp)
                let data = resp.itemToDropList;
                await this.setState({
                    userToDropList: (resp.listOfUsersDrops != undefined) ? resp.listOfUsersDrops : []
                })
                if(this.state.drops.length == 0 && data != null) {
                    for(let j = 0; j < data.length; j++){
                        if(j % 20 == 0){
                            await this.setState({
                                pageCount: this.state.pageCount + 1,
                                pages: this.state.pages.concat(this.state.pageCount + 1),
                            })
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        let book = data[i].book;
                        let captchaId = data[i].id;
                        await this.setState({
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
                                wasRolled: data[i].wasRolled,
                                wasStarted: data[i].wasStarted,
                            })
                        })
                        this.state.dropsCaptchas[captchaId] = false;
                        try{
                            if(!this.state.authors.includes(book.author.toLowerCase())){
                                await this.setState({
                                    authors: this.state.authors.concat({
                                        name: book.author,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.categorys.includes(book.category.toLowerCase())){
                                await this.setState({
                                    categorys: this.state.categorys.concat({
                                        name: book.category,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.languages.includes(book.language.toLowerCase())){
                                await this.setState({
                                    languages: this.state.languages.concat({
                                        name: book.language,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.publishers.includes(book.publisher.toLowerCase())){
                                await this.setState({
                                    publishers: this.state.publishers.concat({
                                        name: book.publisher,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.titles.includes(book.title.toLowerCase())){
                                await this.setState({
                                    titles: this.state.titles.concat({
                                        name: book.title,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.titles.includes(book.title.toLowerCase())){
                                await this.setState({
                                    titles: this.state.titles.concat({
                                        name: book.title,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.publicationDates.includes(book.publicationDate.toLowerCase())){
                                await this.setState({
                                    publications: this.state.publicationDates.concat({
                                        name: book.publicationDate,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                        try{
                            if(!this.state.prices.includes(book.ourPrice)){
                                await this.setState({
                                    prices: this.state.prices.concat({
                                        name: book.ourPrice,
                                    }),
                                })
                            }
                        }
                        catch(err) {}
                    }
                }
                try {
                    await this.setState({
                        authors: this.state.authors.filter((author, index) => index === this.state.authors.findIndex(element => element.name === author.name))
                    })
                }
                catch(err) {}
                try {
                    await this.setState({
                        categorys: this.state.categorys.filter((category, index) => index === this.state.categorys.findIndex(element => element.name === category.name))
                    })
                }
                catch(err) {}
                try {
                    await this.setState({
                        languages: this.state.languages.filter((language, index) => index === this.state.languages.findIndex(element => element.name === language.name))
                    })
                }
                catch(err) {}
                try {
                    await this.setState({
                        publishers: this.state.publishers.filter((publisher, index) => index === this.state.publishers.findIndex(element => element.name === publisher.name))
                    })
                }
                catch(err) {}
                try {
                    await this.setState({
                        titles: this.state.titles.filter((title, index) => index === this.state.titles.findIndex(element => element.name === title.name))
                    })
                }
                catch(err) {}
                try {
                    await this.setState({
                        publicationDates: this.state.publicationDates.filter((publicationDate, index) => index === this.state.publicationDates.findIndex(element => element.name === publicationDate.name))
                    })
                }
                catch(err) {}
                try {
                    await this.setState({
                        prices: this.state.prices.filter((price, index) => index === this.state.prices.findIndex(element => element.name === price.name))
                    })
                }
                catch(err) {}
            })
        }
        this.setState({
            isLoading: false,
        })
    }

    handleDropClick(event){
        let id = event.currentTarget.id
        if(cookies.get('token') == null){
            this.setState({
                wantToJoinDrop: true
            })
        }
        else{
            this.setState({
                dropChosen: true,
                dropChosenId: id
            }, () => {
                console.log(this.state.dropChosenId)
            })
        }
    }

    filterDropsClick(){
        this.fetchdrops().then(() => {
            let filtereddrops = [];
            filtereddrops = this.state.drops.filter((drop) => drop.bookDetails[this.state.filterOption].toLowerCase().includes(this.state.searchInput.toLowerCase()))
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

    joinDrop(event){
        cookies.remove('dropToJoin', { path: '/'})
        if(cookies.get('token') == null){
            this.setState({
                wantToJoinDrop: true
            })
        }
        this.state.dropsCaptchas[event.target.id] = true
        cookies.set('dropToJoin', event.target.id, { path: '/'})
    }

    async signUpOff(){
        this.setState({
            isLoading: true
        })
        await axios.post('/api/signForDrop', {
            dropItemId: cookies.get('dropToJoin'),
            token: cookies.get('token')
        }).then(resp => {
            if(resp.status == 200){
                this.fetchdrops();
            }
        })
    }

    checkIsInDrop(id){
        try{
            for(let i = 0; i < this.state.userToDropList.length; i++){
                if(id == this.state.userToDropList[i]){
                    return true;
                }
            }
            return false;
        }
        catch(err){
            return false;
        }
    }

    sortAsc(that){
        let sortedBooks;
        let sortingOpt = that.state.sortingOption;
        if(sortingOpt == 'price'){
            sortingOpt = 'ourPrice';
        }
        try{
            sortedBooks = that.state.books.sort((a,b)=>{
                if(a["bookDetails"][sortingOpt] < b["bookDetails"][sortingOpt]) return -1;
                if(a["bookDetails"][sortingOpt] > b["bookDetails"][sortingOpt]) return 1;
                return 0;
            })
            that.setState({
                drops: sortedBooks
            })

        }
        catch (err) {}
    }

    sortDsc(that){
        let sortedBooks;
        let sortingOpt = that.state.sortingOption;
        if(sortingOpt == 'price'){
            sortingOpt = 'ourPrice';
        }
        try{
            sortedBooks = that.state.drops.sort((a,b)=>{
                if(a["bookDetails"][sortingOpt] > b["bookDetails"][sortingOpt]) return -1;
                if(a["bookDetails"][sortingOpt] < b["bookDetails"][sortingOpt]) return 1;
                return 0;
            })
            that.setState({
                drops: sortedBooks
            })
        }
        catch (err) {}
    }

    handleSortChange(event){
        this.setState({
            sortingOption: event.target.value,
            isLoading: true
        })
        if(this.state.sortingOrder == 'asc'){
            this.sortAsc(this);
        }
        else{
            this.sortDsc(this);
        }
        this.setState({
            isLoading: false
        })
    }

    sortBooks(event){
        this.setState({
            isLoading: true
        })
        if(event.target.value == 'asc'){
            this.setState({
                sortingOrder: 'asc'
            })
            this.sortAsc(this)
        }
        else{
            this.setState({
                sortingOrder: 'dsc'
            })
            this.sortDsc(this)
        }
        this.setState({
            isLoading: false
        })
    }

    render() {
        const drops = this.state.drops.map((drop) =>
            <Card style={{marginLeft: "5%", marginBottom: "40px", height: '10%', width: '20%', display: "inline-block", backgroundColor: "#4c4c4c", overflowX: "hidden"}} id={drop.id}>
                <Card.Body>
                    <Card.Img style={{width: "60%", height: "300px", cursor: "pointer"}} onClick={this.handleDropClick} id={drop.id} variant="top" src={drop.bookDetails.bookImage} onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src=imageApi.getImageUrl("0");
                    }}/>
                    <Card.Title style={{color: "#4cbde9", cursor: "pointer"}} id={drop.id} onClick={this.handleDropClick}>
                        {drop.dropTitle}
                    </Card.Title>
                    <Card.Subtitle style={{color: "#4cbde9"}}>
                        {drop.bookDetails.author}
                        <br/>
                        {drop.bookDetails.publicationDate}
                        <br/>
                        {drop.bookDetails.pageCount}
                    </Card.Subtitle>
                    <Card.Text style={{color: "#4cbde9"}}>
                        {/*<div hidden={!this.state.dropsCaptchas[drop.id]}>*/}
                        {/*    <Captcha/>*/}
                        {/*</div>*/}
                        <EllipsisText style={{cursor: "pointer"}} text={drop.bookDetails.description} id={drop.id} onClick={this.handleDropClick} length={"130"} />
                        <br/>
                        <strong style={{color: "#f2575b", width: "300px"}}>
                            {drop.wasRolled == true ? "Finished" : drop.wasStarted == true ? 'Started!' : timeLeft(drop.signingDate, this.state.currentTime)}
                        </strong>
                    </Card.Text>
                    <div style={{color: "#4cbde9"}}>
                        {/*<Button disabled={drop.wasStarted == true && drop.wasRolled == false ? false : true} style={{cursor: 'pointer'}} hidden={this.checkIsInDrop(drop.id) || this.state.dropsCaptchas[drop.id]} id={drop.id} variant={"success"} className="btn" onClick={this.joinDrop}>&nbsp;Sign Up</Button>*/}
                        {/*<br/>*/}
                        {/*<Button disabled={drop.wasStarted == true && drop.wasRolled == false ? false : true} style={{cursor: 'pointer'}} hidden={!this.checkIsInDrop(drop.id) || this.state.dropsCaptchas[drop.id]} id={drop.id} variant={"danger"} className="btn" onClick={this.joinDrop}>&nbsp;Sign out</Button>*/}
                        <Button disabled={drop.wasStarted == true && drop.wasRolled == false ? false : true} style={{cursor: 'pointer'}} hidden={this.checkIsInDrop(drop.id) || this.state.dropsCaptchas[drop.id]} id={drop.id} variant={"success"} className="btn" onClick={this.handleDropClick}>&nbsp;Sign Up</Button>
                        <br/>
                        <Button disabled={drop.wasStarted == true && drop.wasRolled == false ? false : true} style={{cursor: 'pointer'}} hidden={!this.checkIsInDrop(drop.id) || this.state.dropsCaptchas[drop.id]} id={drop.id} variant={"danger"} className="btn" onClick={this.handleDropClick}>&nbsp;Sign out</Button>
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

        if(this.state.wantToJoinDrop) {
            return <Navigate to={{pathname: "/login"}} />
        }

        if(cookies.get('captcha') == 'success'){
            cookies.remove('captcha', { path: '/'})
            this.signUpOff()
        }
        else if(cookies.get('captcha') == 'failure'){
            alert('Invalid Captcha')
            cookies.remove('captcha', { path: '/'})
        }

        return (
            <div style={{backgroundColor: "#212121", height: '100%', minHeight: '100vh'}}>
                {this.state.isLoading && <LoadingScreen/>}
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div hidden={this.state.isLoading}>

                    <div>
                        <br/>
                    </div>

                    <div style={{marginLeft: "20%", width: "60%"}}>
                        <Form className="d-flex">
                            <Form.Select style={{ width: "20%", backgroundColor: "#4c4c4c", color: "#4cbde9", cursor: "pointer"}} variant="info" onChange={this.handleFilterChange}>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="category">Category</option>
                                <option value="language">Language</option>
                                <option value="publisher">Publisher</option>
                            </Form.Select>
                            <Typeahead
                                style={{width: "70%", marginLeft: "2%", backgroundColor: "#4c4c4c", color: "#4cbde9"}}
                                id="basic-typeahead-single"
                                labelKey="name"
                                className="me-2"
                                onChange={this.searchOptionClick}
                                options={this.state.options}
                                placeholder="Search"
                            />
                            <Button style={{marginLeft: "1%", backgroundColor: "#4c4c4c", color: "#4cbde9", cursor: "pointer"}} variant="light" onClick={this.filterDropsClick}>Search</Button>
                        </Form>
                        <br/>
                    </div>

                    <div style={{marginLeft: "50%", width: "50%"}}>
                        <Form className="d-flex">
                            <Form.Label style={{ width: "10%", color: "#4cbde9", textAlign: "right", marginTop: "1%", marginLeft: "15%", fontWeight: "bold"}}>
                                Filter with:
                            </Form.Label>
                            <Form.Select style={{ width: "15%", backgroundColor: "#4c4c4c", color: "#4cbde9", marginLeft: "2%", fontWeight: "bold", cursor: "pointer"}} variant="info" onChange={this.handleSortChange}>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="category">Category</option>
                                <option value="language">Language</option>
                                <option value="publisher">Publisher</option>
                                <option value="publicationDate">Publication Date</option>
                                <option value="price">Price</option>
                            </Form.Select>
                            <Form.Label style={{ width: "10%", color: "#4cbde9", textAlign: "right", marginTop: "1%", fontWeight: "bold"}}>
                                Order:
                            </Form.Label>
                            <Form.Select style={{ width: "15%", backgroundColor: "#4c4c4c", color: "#4cbde9", marginLeft: "2%", fontWeight: "bold", cursor: "pointer"}} variant="info" onChange={this.sortBooks}>
                                <option value="asc">Ascending</option>
                                <option value="dsc">Descending</option>
                            </Form.Select>
                        </Form>
                        <br/>
                    </div>

                    <Tabs style={{alignItems: "center", justifyContent: "center"}} defaultActiveKey="1" className="mb-3" onSelect={this.updatePage}>
                        {pages}
                    </Tabs>

                    <div style={{height: "300px", marginTop: "50px", backgroundColor: "#212121"}}>
                        <Row style={{textAlign: "center", alignItems: "center", backgroundColor: "#212121", color: "#4cbde9"}} xs={5}>
                            {drops.length > 0 ? drops :  (<p style={{textAlign: "center", color: "#4cbde9"}}>No Drops in Store</p>)}
                        </Row>
                        <Footer/>
                    </div>
                </div>
            </div>
        );
    }
}

export {DropsPage};
