const hostel=require("../models/hostel");
const comment=require("../models/comment");
const jwt = require('jsonwebtoken');

const middleware_obj={};

middleware_obj.check_hostel_ownership = function check_hostel_ownership(req,res,next){
    // checks if the user is logged in
    if (req.isAuthenticated())
    {
        hostel.findById(req.params.id, function(error, hostel_found){
            if (error)
            {
                // console.log(error);
                req.flash("error", "Cannot find the hostel");
                res.render("/hostels");
            }
            else
            {
                // checks if the user is the author
                if (hostel_found.author.id.equals(req.user.id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You do not have the permission to perform edit on this hostel");
                    res.redirect("back");
                }
            }
        })
    }
    else
    {
        req.flash("error", "Please login to proceed");
        res.redirect("back")
    }
}


middleware_obj.check_comment_ownership = function check_comment_ownership(req,res,next)
{
    // check if the user is logged in
    if (req.isAuthenticated())
    {
        comment.findById(req.params.comment_id, function(error, comment_found){
            if (error)
            {
                req.flash("error", "Cannot find comment");
                // console.log(error);
                res.redirect("back");
            }
            else
            {
                // check if the user is author of post
                if (comment_found.author.id.equals(req.user.id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You do not have the permission to perform edit on this comment");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "Please login to proceed");
        res.redirect("back");
    }
}

middleware_obj.isloggedin = function isloggedin(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("token", token);
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded user", decoded);
        req.user = decoded; // Attach decoded user data to req.user
        next();
    } catch (ex) {
        console.log("Token verification failed", ex);
        return res.status(401).json({ error: "Invalid token." });
    }
};


module.exports= middleware_obj;
