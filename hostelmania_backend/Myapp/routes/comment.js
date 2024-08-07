const express = require("express");
const router = express.Router({ mergeParams: true });
const Hostel = require("../models/hostel");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Comments-new route
router.get("/new", middleware.protectRoute, async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id).exec();
        if (!hostel) {
            console.error("Hostel not found");
            return res.status(404).json({ error: "Hostel not found" });
        }
        console.log("Hostel searched successfully");
        return res.status(200).json({ hostel }); // Sending JSON response
    } catch (error) {
        console.error("Error encountered while searching hostel", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Comment-new route
router.post("/", middleware.protectRoute, async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id).exec();
        if (!hostel) {
            console.error("Hostel not found");
            return res.status(404).json({ error: "Hostel not found" });
        }

        const newComment = new Comment(req.body.comment);
        newComment.author.id = req.user.id;
        newComment.author.username = req.user.username;
        await newComment.save();

        hostel.comments.push(newComment);
        await hostel.save();

        console.log("Comment added successfully");
        return res.status(201).json({ message: "Comment added successfully", comment: newComment }); // Sending JSON response
    } catch (error) {
        console.error("Error while adding comment", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Comment-edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comment_id).exec();
        if (!comment) {
            console.error("Comment not found");
            return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json({ comment, hostel_id: req.params.id }); // Sending JSON response
    } catch (error) {
        console.error("Error while fetching comment", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Comment-update route
router.put("/:comment_id", middleware.checkCommentOwnership, async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, { new: true }).exec();
        if (!updatedComment) {
            console.error("Comment not found");
            return res.status(404).json({ error: "Comment not found" });
        }
        console.log("Comment updated successfully");
        return res.status(200).json({ message: "Comment updated successfully", comment: updatedComment }); // Sending JSON response
    } catch (error) {
        console.error("Error while updating comment", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Comment-delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.comment_id).exec();
        if (!deletedComment) {
            console.error("Comment not found");
            return res.status(404).json({ error: "Comment not found" });
        }
        console.log("Comment deleted successfully");
        return res.status(200).json({ message: "Comment Deleted!" }); // Sending JSON response
    } catch (error) {
        console.error("Error while deleting comment", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
