const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const https=require("https");
const app=express();
const ejs=require("ejs");
const _=require("lodash");
//const date=require(__dirname+"/date.js");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine',"ejs");
app.use(express.static("public"));

//const items=["wash hair","eat","exercise"];
//const workItems=["Python","NodeJs","ReactJs"];

mongoose.connect("mongodb+srv://Admin:Test@123@cluster0.9utxw.mongodb.net/ToDoList_DB",{ useUnifiedTopology: true ,useNewUrlParser: true });

const itemSchema=new mongoose.Schema({
  itemName:String
});

const listSchema=new mongoose.Schema({
  listName:String,
  listItems:[itemSchema]
});

const Item=new mongoose.model("Item",itemSchema);
const List=new mongoose.model("List",listSchema);

const item1=new Item({itemName:"Welcome to TODO List."});
const item2=new Item({itemName:"Hit the + button to add a new Item."});
const item3= new Item({itemName:"<-- Hit this to delete the item."});

app.get("/",function(req,res){

Item.find({},function(err,items){
  if(err){console.log(err)}
  else{
    if(items.length===0){

      Item.insertMany([item1,item2,item3],function(error){
        if(error){console.log(error)}
        else{console.log("default items inserted")};
      })
      res.redirect("/");
    }
    else {
        res.render("list",{listTitle:"Today",newtodoItem:items});
    }

  }
})

});

// app.get("/work",function(req,res){
//   res.render("list",{listTitle:"Work",newtodoItem:workItems});
// });
app.get("/:CustomDoList",function(req,res){
  const customDoListName=_.capitalize(req.params.CustomDoList);

  List.findOne({listName:customDoListName},function(err,foundList){
    if(!err){
      if(!foundList){
        const list=new List({
          listName:customDoListName,
          listItems:[item1,item2,item3]
        });
        list.save();
        res.redirect("/"+customDoListName);

      }
      else{
      res.render("list",{listTitle:foundList.listName,newtodoItem:foundList.listItems});

      }
    }else{
      console.log("List do not exist")
    }
  })

})
app.get("/about",function(req,res){
  res.render("About");
})

app.post("/",function(req,res){
const item=new Item({itemName:req.body.todoItem});
const listname=req.body.listName;
//const day = date.getDay();
if(listname==="Today"){
  item.save();
  res.redirect("/");
}else{
  List.findOne({listName:listname},function(err,foundList){
    foundList.listItems.push(item);
    foundList.save();
    res.redirect("/"+req.body.listName);
  });
}
});


app.post("/delete",function(req,res){
  const deleteItemId =req.body.checkbox;
  const listname=req.body.listN;

  if(listname==="Today"){
    Item.findByIdAndRemove(deleteItemId,function(err){
    res.redirect("/");
  });
  }
  else{
    List.findOneAndUpdate({listName:listname},{$pull:{listItems:{_id:deleteItemId}}},function(error,foundList){

      if(!error){
        res.redirect("/"+listname);
      }

    })
  }
});
let port=process.env.PORT;
if(port==null || port==""){
  port=3000;
}
app.listen(port,function(){
  console.log("server running at "+port);
})
