import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header'
import AddContact from './AddContact'
import ContactList from './ContactList'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ContactDetail from './ContactDetail';
import EditContact from './EditContact';
import api from "../api/contacts";

function App() {

  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const[searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Retrieve contacts from json server
  const retrieveContacts = async()=>{
    const response = await api.get("/contacts");
    return response.data;
  }

  useEffect(() => {
    const getAllContacts = async ()=>{
      const contacts = await retrieveContacts();
      if(contacts) setContacts(contacts);
    }
    getAllContacts();
  }, []);


  const addContactHandler = async (contact) => {
    const request = {
      id:Math.floor(Math.random() * 500),
      ...contact
    }
    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);
  }

  const editContactHandler = async (contact)=>{
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const{id, name, email} = response.data;
    setContacts(contacts.map((contact)=>{
      return contact.id === id ? {...response.data} : contact;
    }));
  }

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter(contact => {
      return contact.id !== id;
    })
    setContacts(newContactList);
  }

  const filterContacts = (searchKeyword)=>{
    setSearchTerm(searchKeyword);
    if(searchKeyword !== ""){
      const matchingContacts = contacts.filter(contact => {
        return Object.values(contact).join(" ").toLowerCase().includes(searchKeyword.toLowerCase());
      });
      setSearchResults(matchingContacts);
    }
    else{
      setSearchResults(contacts);
    }
  }

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact render={(props)=> (<ContactList {...props} contacts={searchTerm.length < 1 ? contacts : searchResults} 
            removeContactHandler={removeContactHandler} searchHandler={filterContacts} searchTerm={searchTerm}/>)}></Route>
          <Route path="/add" exact render={(props)=> (<AddContact {...props} addContactHandler={addContactHandler}/>)}></Route>
          <Route path="/contact/:id" exact render={ContactDetail}></Route>
          <Route path="/edit" exact render={(props)=> (<EditContact {...props} editContactHandler={editContactHandler}/>)}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
