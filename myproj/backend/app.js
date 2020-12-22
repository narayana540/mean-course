const path = require("path");
const express=require('express');

const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts')


mongoose.connect('mongodb+srv://narayan:u6aqolaX0svARjQf@cluster0.tqlkx.mongodb.net/node-angular?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
  console.log("connected to database");
}).catch(()=>{
  console.log("connection failed")
})
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept');
res.setHeader('Access-control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTIONS')
  next();
})

app.use("/api/posts",postRoutes);

module.exports=app;

