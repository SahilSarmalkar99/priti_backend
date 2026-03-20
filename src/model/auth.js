const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
  },

email : {
    type : String,
    required : true,
    unique : true,
},

password : {
    type : String,
    required : true,
},

role : { 
    type : String,
    enum : ["Manager" , "Staff"],
    default : "Staff"
},
} ,{timestamps : true});

const authModel = mongoose.model("auth" , authSchema);

module.exports = authModel;
