const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone_number:{type:String,required:true},
    department:{type:String,required:true}
})

const Usermodel=mongoose.model("user",userSchema)

module.exports=Usermodel