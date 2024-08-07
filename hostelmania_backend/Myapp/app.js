
const express=require("express");
const app=express();
const body_parser=require("body-parser");
const mongoose=require("mongoose");
const flash=require("connect-flash");
const passport=require("passport");
const local_strategy=require("passport-local");
const method_override=require("method-override");
const hostel=require("./models/hostel");
const comment=require("./models/comment");
const user=require("./models/user");
const cors = require("cors");

// const seedDB=require("./seedDB.js");
require('dotenv').config();

// importing routes
const hostel_routes=require("./routes/hostel.js");
const comment_routes=require("./routes/comment.js");
const auth_routes=require("./routes/auth.js");

// configuring app
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN // Adjust this to match your frontend origin
  }));

//   const corsOptions = {
//     origin: process.env.FRONTEND_ORIGIN, // Allow your frontend origin
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // Allow cookies to be sent with the request
//     optionsSuccessStatus: 204
//   };
  
// app.use(cors(corsOptions));
app.use(express.json()); 
app.use(body_parser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(method_override("_method"));
app.use(flash());

// configuring mongoose
const db_url = process.env.database_url || "mongodb://localhost/HostelMania"
mongoose.set('strictQuery', false);
mongoose.connect(db_url);

// configuring passport 
app.use(require("express-session")({
    secret: "bjhevbjfwheihifhwuoahouhuhoububljabjbvran.vn",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local_strategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.user=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

// root route
app.get("/",function(req,res){
    res.render("home");
})

app.use(auth_routes);
app.use("/hostels", hostel_routes);
app.use("/hostels/:id/comments", comment_routes);

const port=process.env.PORT || 3000;
app.listen(port, process.env.IP, function(){
    console.log("The HostelMania server have started at port " +  port);
})