import  mongoose  from "mongoose";

const schema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        unique : true,
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role:{
        type: String,
        default: "user"
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
});

export const User = mongoose.model("User", schema);