const express = require("express");
const router = express.Router({ mergeParams: true });
const Hostel = require("../models/hostel");
const Comment = require("../models/comment");
const User = require("../models/user");
const middleware = require("../middleware");

// Protect route with middleware.protectRoute
router.get("/", middleware.protectRoute, async (req, res) => {

    const userId = req.query.user_id;
    const query = userId ? {"author.id": userId}: {};

    try {
        const hostels = await Hostel.find(query).exec();
        console.log("Search request was successful");
        return res.status(200).json({ hostels });
    } catch (error) {
        console.log("We have encountered an error:");
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", middleware.protectRoute, async (req, res) => {
    try {
        // Fetch user details
        const user_obj = await User.findById(req.user.id).exec(); // Use .exec() for better handling

        if (!user_obj) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create the new hostel
        const temp = new Hostel({
            name: req.body.name,
            image: req.body.image_url,
            description: req.body.description,
            author: {
                id: user_obj._id,
                username: user_obj.username
            },
            price: req.body.price
        });

        // Save the hostel to the database
        const savedHostel = await temp.save();

        // Send success response
        return res.status(201).json({ message: "Hostel saved successfully", hostel: savedHostel });
    } catch (error) {
        console.error("Encountered an error:", error);
        if (!res.headersSent) { // Check if headers have already been sent
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

router.get("/:id", middleware.protectRoute, async (req, res) => {
    try {
        const hostel_found = await Hostel.findById(req.params.id).populate("comments").exec();
        console.log("Hostel data found successfully:", hostel_found);
        return res.status(200).json({ hostel_found });
    } catch (error) {
        console.log("Error encountered while finding hostel data:", error);
        return res.status(500).json({ error: "Error encountered while finding hostel data" });
    }
});

// Update hostel route (currently commented out, but should use middleware.protectRoute if implemented)
router.put("/:id", middleware.protectRoute, async (req, res) => {
    try {
        const updatedHostel = await Hostel.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                image: req.body.image_url,
                description: req.body.description,
                price: req.body.price
            },
            { new: true } // Return the updated document
        ).exec();

        if (!updatedHostel) {
            return res.status(404).json({ error: "Hostel not found" });
        }

        return res.status(200).json({ message: "Hostel updated successfully", hostel: updatedHostel });
    } catch (error) {
        console.error("Error updating hostel:", error);
        return res.status(500).json({ error: "Error updating hostel" });
    }
});

// Delete hostel route
router.delete("/:id", middleware.protectRoute, middleware.checkHostelOwnership, async (req, res) => {
    try {
        const hostel_delete = await Hostel.findByIdAndRemove(req.params.id).exec();

        if (!hostel_delete) {
            return res.status(404).json({ error: "Hostel not found" });
        }

        await Comment.deleteMany({ _id: { $in: hostel_delete.comments } }).exec();
        console.log("Comments deleted!");
        return res.status(200).json("Hostel deleted");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error in removing hostel" });
    }
});

module.exports = router;
