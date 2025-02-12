const mongoose = require('mongoose');

const ChatModel = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    picture:{
        type:String,
        // required:true
    }
    
}, { timestamps: true });

const  chat= mongoose.model('roomchat', ChatModel);
module.exports = chat;
