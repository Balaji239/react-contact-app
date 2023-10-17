import React, {useRef} from "react";
import ContactCard from "./ContactCard";
import { Link } from "react-router-dom";

const ContactList = (props) => {

    const searchEleRef = useRef("");

    const deleteContactHandler = (id) => {
        props.removeContactHandler(id);
    }


    const renderContactList = props.contacts.map(contact => {
        return (
            <ContactCard contact={contact} clickHandler={deleteContactHandler} key={contact.id}></ContactCard>
        )
    })

    const searchContact = ()=>{
        props.searchHandler(searchEleRef.current.value);
    }

    return (
        <div className="main">
            <h2>
                Contact List
                <Link to="/add"><button className="ui button blue right">Add Contacts</button></Link>
            </h2>
            <div className="ui search">
                <div className="ui icon input">
                    <input type="text" ref={searchEleRef} placeholder="Search Contacts" className="prompt" onChange={searchContact} value={props.searchTerm}></input>
                    <i className="search icon"></i>
                </div>
            </div>
            <div className="ui celled list">
                {renderContactList.length > 0 ? renderContactList : "No contacts found"}
            </div>
        </div>
    )
}

export default ContactList;