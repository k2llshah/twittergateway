var express = require("express");
//var router = express.Router();

module.exports=function(app,passport){

var posts=require('../controllers/post_controller.js');
var auth=require('../controllers/auth_controller.js');
var users=require('../controllers/user_controller.js');


app.get("/", function(req, res) {
	app.use(express.static('public'));
  res.render("index", { title: "Twitplus" });
});


app.post("/register",users.register);
app.post("/login", auth.login);
app.get("/logout",auth.logout);
app.get("/loadTweets", posts.loadTweets);
app.post("/tweet",posts.tweet );
app.post("/postTwitter",posts.postTwitter);
app.post("/editProfile",users.editProfile);
app.post("/likePost",posts.likePost);
app.post("/disLikePost",posts.disLikePost);
app.post("/newGroup",users.newGroup);
app.post("/loadGroups",users.loadGroups);
app.get("/checkSession",auth.checkSession);
app.get("/getAllUsers",users.getAllUsers);

}