const { nanoid }  = require('nanoid');
const fsPromises = require('fs/promises');
const path = require('node:path'); 
const contactsPath = path.join(__dirname, '..','db', 'contacts.json');

async function listContacts() {
    const buffer = await fsPromises.readFile(contactsPath);
    const contactsJson = buffer.toString(); 
    const contactsArr = JSON.parse(contactsJson);
    return contactsArr;  
}

async function getContactById(contactId) {
    const contactsArr = await listContacts();
    const foundContact = contactsArr.find(contact => contact.id === contactId); 
    if (!foundContact) {
        return null;
    } 
    return foundContact;    
}

async function addContact(name, email, phone) {
    const contactsArr = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    }
    contactsArr.push(newContact);
    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2));
    return newContact;
}

async function removeContact(contactId) { 
    const contactsArr = await listContacts();
    const index = contactsArr.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [deleteContact] = contactsArr.splice(index, 1);
    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2));
    return deleteContact;
}

async function updateContactById(id, contactData) {
    const contactsArr = await listContacts();
    const index = contactsArr.findIndex(contact => contact.id === id);
    if (index === -1) {
        return null;
    }
    contactsArr[index] = { id, ...contactData };
    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2));
    return contactsArr[index]; 
}

module.exports = {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContactById,
}