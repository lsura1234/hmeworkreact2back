const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const md5 = require("md5");
const mongoose = require("mongoose");
const connect = `mongodb://localhost:27017/invoice?authSource=admin`;


var cors = require('cors')

mongoose.connect(connect, { useNewUrlParser: true });
app.use(cors())
app.use(bodyParser.json());
var db = mongoose.connection;

db.on("connected", function() {
    console.log("connected");
  });


  const Schema = mongoose.Schema;
  const user = new mongoose.Schema({
    "username":String,
    "password":String
  });
  const invoice = new mongoose.Schema({
    "Invoice_number":String,
    "Invoice_date":Date,
    "Invoice_amount":Number,
    "due_date":Date,
    "Customer_name":String,
    "country":String,
    "item_name":String,
    "item_qty":Number,
  });

  let users = mongoose.model("user", user);
  let invoices = mongoose.model("invoice", invoice);

  app.use(bodyParser.json());
  app.post("/user/register",async (req, res) => {
    users.find({ username:req.body.username},(err , data) =>{
        
          if(data.length!==0) //res.send(req.body)
             res.send("fall1");
          else if (req.body.password !== req.body.passwordConfirm){
              console.log(req.body.password +" " + req.body.passwordConfirm)
            res.send("fall2")

          }
            
          else{
            users.create({
                "username":req.body.username,
                "password":md5(req.body.password)
            })
            res.send("success");
          }
          
    })
    
  });
  app.post("/user/login", async (req,res) => {
      
      
      users.find({ username:req.body.username,password:md5(req.body.password)}, (err,data) => {
            if(data.length !== 0 )
                res.json(data);
            else
                res.send("fall");
      })
  });



  app.post("/insert", async (req,res) => {
    invoices.create({
      Invoice_number:req.body.invoice_number,
      Invoice_date:req.body.Invoice_date,
      Invoice_amount:req.body.Invoice_amount,
      due_date:req.body.due_date,
      Customer_name:req.body.Customer_name,
      country:req.body.country,
      item_name:req.body.item_name,
      item_qty:req.body.item_qty,
    })
    console.log(req.body);
    res.send("success");
    
});
app.post("/find", async (req,res) => {
  if(req.body.findData){
    invoices.find({ 
      $and:[
        {Customer_name:req.body.username},
        {country:req.body.findData}
       ]
     },(err,data) => {
       res.json(data);
    })
  }
  else{
    invoices.find({Customer_name:req.body.username },(err,data) => {
      res.json(data);
   })
  }
   
  

})








app.listen(3000);