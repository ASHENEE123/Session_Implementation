const ser=require("express")
const session=require("express-session")
const limit=require("express-rate-limit")
const path=require("path")
const Joi=require("joi")
const crypt=require("bcrypt")
const app=ser()
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"template"))
app.use(ser.urlencoded({extended:true}))
app.use(session({
    secret:"Enter your Own secret Key",
    name:"Enter session Name",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1*60*1000,
        secure:false,
        httpOnly:true,
    }
}));
app.use("/dashboard",limit({
    windowMs:5*60*1000,
    max:5,
    KeyGenerator:(req)=>req.session.id,
    message:"sry out of requests"
}))


app.get("/dashboard",(req,res,next)=>{
    if(req.session.username){
        next()
    }else{
        res.send("cannot access it")
    }
},(req,res)=>{
    res.send(`welcome to the dashboard ${req.session.username}`)
})
app.use("/login",limit({
    windowMs:5*60*1000,
    max:5,
    message:"sry out of requests"
}))
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/data",async(req,res)=>{
    const {username,password}=req.body
    const schema=Joi.string().alphanum().min(10).max(20).required()
    const {error,value}=schema.validate(password)
    if(error){
        console.log(error.details[0].message)
    }
    else{
        console.log("ok continue",value)
    }
    const hash= await crypt.hash(password,10)
        req.session.pass=hash;
        console.log("paswwordhashed succesfully")
    req.session.username=username;
     res.send("data is correct")
})
app.get("/sign-up",(req,res)=>{
      res.render("sign")
})
app.post("/check",async(req,res)=>{
 const word=req.body.password
 if(req.session.pass){
    console.log("ok go ahead")
 }
 else{
    res.send("cannot retreive password")
 }
 const result= crypt.compare(req.session.pass,word)
  if(result){
    res.send("same user")
  }
  else{
  res.send("different user")}
})
app.get("/logout",(req,res)=>{
   req.session.destroy((err)=>{
    if (err) throw err.message
    res.clearCookie("Enter the Name of Session")
    res.send("succesfully logout")
   })
})
app.listen(3000,(err)=>{
    if (err) throw err;
    console.log("success")
})