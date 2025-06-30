const mongoose = require("mongoose");

const connectDB = async ()=>{
    mongoose.connect('mongodb+srv://Ambig123:KfdWam70L4qnbXG0@learningnodej.tsfjxjo.mongodb.net/devTinder')
}

module.exports = connectDB;

