const mongoose=require("mongoose")

const noticeSchema=mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    category:{type:String,required:true,enum:['parking','covid','maintenance']},
    date:{type:Date,required:true,default:Date.now()},

})

const Noticemodel=mongoose.model("notice",noticeSchema)

module.exports=Noticemodel