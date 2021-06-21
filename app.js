const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const app=express();
const date=require(__dirname+"/date.js");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine',"ejs");
app.use(express.static("public"));

const items=["wash hair","eat","exercise"];
const workItems=["Python","NodeJs","ReactJs"];

app.get("/",function(req,res){
const day = date.getDay();
res.render("list",{listTitle:day,newtodoItem:items});
});

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work",newtodoItem:workItems});
});
app.get("/about",function(req,res){
  res.render("About");
})

app.post("/",function(req,res){
const item=req.body.todoItem;
if(req.body.listName=="Work"){
  workItems.push(item);
  res.redirect("/work");
}else{
  items.push(item);
  res.redirect("/");
}
})

app.listen(process.env.PORT||3000,function(){
  console.log("server running");
})
