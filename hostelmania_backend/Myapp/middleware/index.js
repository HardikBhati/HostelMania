const Hostel = require("../models/hostel");
const Comment = require("../models/comment");
const jwt = require('jsonwebtoken');

const middleware = {};

middleware.checkHostelOwnership = async (req, res, next) => {
    try {
        const hostel = await Hostel.findById(req.params.id).exec();
        if (!hostel) {
            req.flash("error", "Cannot find the hostel");
            return res.redirect("/hostels");
        }
        if (hostel.author.id.equals(req.user.id)) {
            return next();
        } else {
            req.flash("error", "You do not have permission to edit this hostel");
            return res.redirect("back");
        }
    } catch (error) {
        console.error("Error finding hostel:", error);
        req.flash("error", "An error occurred while finding the hostel");
        return res.redirect("back");
    }
};

middleware.checkCommentOwnership = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.comment_id).exec();
        if (!comment) {
            req.flash("error", "Cannot find comment");
            return res.redirect("back");
        }
        if (comment.author.id.equals(req.user.id)) {
            return next();
        } else {
            req.flash("error", "You do not have permission to edit this comment");
            return res.redirect("back");
        }
    } catch (error) {
        console.error("Error finding comment:", error);
        req.flash("error", "An error occurred while finding the comment");
        return res.redirect("back");
    }
};

middleware.isLoggedIn = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.error("No token provided");
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user data to req.user
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ error: "Invalid token." });
    }
};

// Protect routes with the isLoggedIn middleware
middleware.protectRoute = (req, res, next) => {
    middleware.isLoggedIn(req, res, () => {
        next();
    });
};

module.exports = middleware;

