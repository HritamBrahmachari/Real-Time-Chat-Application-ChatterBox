import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    username:{
      type:String,
      required:true,
      unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:["male", "female", "system"],
        required:true
    },
    hasSeenWelcome:{
        type: Boolean,
        default: false
    },
    isSystemUser:{
        type: Boolean,
        default: false
    }
}, {timestamps:true});
export const User = mongoose.model("User", userModel);
