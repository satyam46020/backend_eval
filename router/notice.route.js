const express=require("express")
const jwt=require("jsonwebtoken")
const Noticemodel=require("../models/Notice.model")
const Usermodel=require("../models/User.model")

const noticeRouter=express.Router();

noticeRouter.post("/create",async (req,res)=>{
    try {
        const {title,body,category,date}=req.body;
        const userId=req.userId
        const user=await Usermodel.findOne({_id:userId})
        const notice_id=user._id

        const notice=await Noticemodel.create({title,body,category,date})
        res.send(notice)
        // ,{msg:"notice created"})
    } catch (error) {
        res.send({msg:"Error creating notice"})
        console.log(error)
    }
})

noticeRouter.get("/read",async (req,res)=>{
    try {
        const {category}=req.query;
        const query=category?{category,user:req.user._id}:{user:req.user._id}
        const notices=await Noticemodel.find(query);
        res.send(notices)
    } catch (error) {
        res.send({msg:"Something went wrong!!"})
    }
})

noticeRouter.patch("/edit/:id",async (req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=['title','body','category','date'];
    const valid=updates.every((update)=>allowedUpdates.includes(update));
    if(valid){
        return res.send({msg:"invalid updates"})
    }
    try {
        const notice=await Noticemodel.findOne({_id:req.params.id,user:req.user._id})
        if(!notice){
            return res.send({msg:"notice updated"})

        }
        updates.forEach((update)=>(notice[update]=req.body[update]));
        await notice.save();
        res.send(notice);
    } catch (error) {
        res.send({msg:"error updating"})
    }
})

noticeRouter.delete("/delete/:id",async (req,res)=>{
    try {
        const notice=await Noticemodel.findOneAndDelete({_id:req.params.id,user:req.user._id})
        if(!notice){
            return res.send({msg:"not authorized to delete"})
        }
        res.send(notice)
    } catch (error) {
        res.send({msg:"Error deleting"})
    }
})

module.exports=noticeRouter
