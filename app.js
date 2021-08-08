require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express(); 
  
app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));  

mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true});
  
const itemsSchema={   
  name : String 
};  
const Item = mongoose.model("item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todo list!!!1"
});

const item2=new Item({
  name:"Welcome to your todo list!!!2"
});

const item3=new Item({
  name:"Welcome to your todo list!!!3"
});
const defaultItems=[item1,item2,item3];


const listSchema = {
  name: String,
  items: [itemsSchema]
};
 
const List= mongoose.model("List",listSchema);

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("added to db");  
        }
      });
      res.redirect("/");
    }else{
      console.log(foundItems);
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
 

});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const newItem = new Item({
    name: itemName 
  })
  newItem.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox; 
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Deleted Item"); 
      res.redirect("/");
    }
  })
});
  
app.get("/:listName",function(req,res){
  const customListName=req.params.listName;

});

app.get("/about", function(req, res){
  res.render("about");
});
let port= process.env.PORT;
if(port==null || port ==""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
