const { nanoid } = require('nanoid');
const fsPromises = require('fs/promises');
const path = require('node:path'); 
const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
    try {
        const buffer = await fsPromises.readFile(contactsPath);
        const contactsJson = buffer.toString(); 
        const contactsArr = JSON.parse(contactsJson);
        return contactsArr;
    } catch (error) {
        console.log(error.message);
    }
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
    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2)).catch(error => console.log(error.message));
    return newContact;
}

async function removeContact(contactId) { 
    const contactsArr = await listContacts();
    const index = contactsArr.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [deleteContact] = contactsArr.splice(index, 1);
    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2)).catch(error => console.log(error.message));
    return deleteContact;
}

module.exports = {
    listContacts,
    getContactById,
    addContact,
    removeContact,
}