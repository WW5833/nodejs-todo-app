const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/todo')

const Users = mongoose.Schema({
    Username: String,
    Password: String
},
{ 
    collection:'Users'
});

module.exports = mongoose.model('Users', Users);