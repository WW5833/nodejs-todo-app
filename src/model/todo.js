const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/todo')

const Todo = mongoose.Schema({
    Title: String,
    Date: Date,
    State: Boolean,
    User:  { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
},
{ 
    collection:'ToDo'
});

const db = module.exports = mongoose.model('ToDo', Todo);