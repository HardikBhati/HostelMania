const hostel=require("../models/hostel");
const comment=require("../models/comment");

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

middleware_obj.isloggedin = function isloggedin (req,res,next){
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: "Invalid token." });
    }
    if (req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "Please login to proceed");
    res.redirect("/login");
}

module.exports= middleware_obj;