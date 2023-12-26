const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')

const connection=require("./db")
const Usermodel=require("./models/User.model")
const noticeRouter=require("./router/notice.route")
const app=express();

require("dotenv").config()
app.use(express.json())

const auth=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.send({msg:"login first"})
    }
    jwt.verify(token, process.env.jwt_secret, function(err, decoded) {
        if(decoded){
            const userId=decoded.userId
            req.userId=userId
            next();
        }
    });
}

app.post("/signup",async (req,res)=>{
    const {name,email,password,phone_number,department}=req.body;
    try {
        bcrypt.hash(password, 4, async function(err, hash) {
            await Usermodel.create({name,email,password:hash,phone_number,department})
            return res.send({msg:"signup successfull"})
        });
    } catch (error) {
        console.log(error)
        return res.send({msg:"something went wrong!"})
        
    }
})

app.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    const user=await Usermodel.findOne({email})
    if(!user){
        return res.send({msg:"invalid credentials"})
    }
    const hash_password=user.password
    bcrypt.compare(password, hash_password, function(err, result) {
        if(result){
            const token= jwt.sign({ userId: user._id }, process.env.jwt_secret);
            return res.send({msg:"login successfull",token:token})
        }
        else{
            return res.send({msg:"login failed"})
        }
    });
})

app.use("/notice",auth,noticeRouter)

const PORT=process.env.port;
app.listen(PORT,async ()=>{
    try {
        await connection
        console.log("connected to mongodb")
    } catch (error) {
        console.log("error connecting mongodb")
        console.log(error)
    }
    console.log("listening to port "+ PORT)
})
