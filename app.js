var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var app=express();
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);
var nodemailer = require("nodemailer");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/route_help', {useNewUrlParser: true});
app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");


var BlogSchema=new mongoose.Schema({
      title:String,
      image:String,
      body:String
})

var Blog=mongoose.model("Blog",BlogSchema);
var imgSchema=new mongoose.Schema({
    img:String,
    name:String
})

var IMG=mongoose.model("IMG",imgSchema)


app.get("/",function(req,res){
    IMG.find({},function(err,image){
        if(err){
             console.log(err)
        }else{
            res.render("home", {images:image})
        }
    })
    
})

app.get("/products",function(req,res){
   
    res.render("products")
})

app.get("/products/:id",function(req,res){
     console.log(req.params.id)
   
     IMG.findById(req.params.id,function(err,findimg){
          if(err){
              res.redirect("/")
          }
          else{
              res.render("viewprod",{img:findimg})
          }
     })

})

app.get("/blog",function(req,res){
  Blog.find({},function(err,Blogse){
      if(err){
          console.log(err)
      }else{
           res.render("index",{Bloge:Blogse})
          
      }
  })
    
   
})
app.get("/blog/editblog",function(req,res){
      res.render("editer")
     
})
app.post("/blog",function(req,res){
       Blog.create(req.body.blog,function(err,blog){
           if(err){
               res.render("editer")
           
       }
         else{
              res.redirect("/blog")
         }
       })
    
})
//show route
app.get("/blog/:id",function(req,res){
     Blog.findById(req.params.id,function(err,showBlog){
           if(err){
               res.redirect("/blog")
           }else{
                res.render("show",{blog:showBlog})
           }
         
     })
})


app.get("/contact",function(req,res){
    res.render("contact")
})


app.post("/send",function(req,res){
   const output=`
     <li>  ${req.body.name}</li>
      <li>  ${req.body.last}</li>
   `


 let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "15uec032@lnmiit.ac.in", 
      pass:  "*************"
    },
    tls:{
       rejectUnauthoRized:false
   }
  });

  
  let info = {
    from: '"Lovely 👻" <15uec032@lnmiit.ac.in>', // sender address
    to: "singhetoos65@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject in line
    text: "Hello world?", // plain text body of user
    html: output// html body for email
  }
transporter.sendMail(info,function(error,info){
    if(error){
        return console.log(error)
    }
     console.log("Message sent: %s", info.messageId);
  

 
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.render("contact")
    
})
 
       
       
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server has started")
})
