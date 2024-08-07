const express=require("express");
const router=express.Router({mergeParams: true});
const hostel=require("../models/hostel")
const comment=require("../models/comment");
const user=require("../models/user");
const middleware=require("../middleware");
const authenticateJWT = require("../middleware/authenticate_jwt")


router.get("/", authenticateJWT, (req, res) => {
    const authorUsername = req.query.username;
    const query = authorUsername ? { "author.username": authorUsername } : {};
    
    hostel.find(query, (error, hostels) => {
        if (error) {
            console.log("We have encountered an error:");
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        } else {
            console.log("Search request was successful");
            return res.status(200).json({ hostels });
        }
    });
});

router.post("/", middleware.isloggedin, async (req, res) => {
    try {
        // Fetch user details
        const user_obj = await user.findById(req.user.id).exec(); // Use .exec() for better handling
        
        if (!user_obj) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create the new hostel
        const temp = new hostel({
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

// new route
router.get("/new", function(req,res){
    res.render("hostels/new");
})

// show route
router.get("/:id", authenticateJWT, function(req, res) {    
    hostel.findById(req.params.id).populate("comments").exec(function(error, hostel_found) {
        if (error) {
            console.log("Error encountered while finding hostel data:", error);
            return res.status(500).json({ error: "Error encountered while finding hostel data" });
        }
        
        console.log("Hostel data found successfully:", hostel_found);
        return res.status(200).json({ hostel_found });
    });
});


// edit hostel route
router.get("/:id/edit", middleware.check_hostel_ownership, function(req,res){
    hostel.findById(req.params.id, function(error, hostel_found){
        if (error)
        {
            res.redirect("/");
        }
        else
        {
            res.render("hostels/edit", {hostel:hostel_found});
        }
    })
})

// update hostel route
router.put("/:id", middleware.check_hostel_ownership, function(req,res){
    hostel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image_url,
        description: req.body.description,
        price: req.body.price
        }, function(error, hostel_update){
        if (error)
        {
            console.log(error);
            res.redirect(req.params.id+"/edit");
        }
        else
        {
            res.redirect(req.params.id);
        }
    })
});

// destroy hostel route
router.delete("/:id", middleware.check_hostel_ownership, function(req,res){
    hostel.findByIdAndRemove(req.params.id, function(error, hostel_delete){
        if (error)
        {
            console.log(error);
            res.status(404).json({ error: "Error in removing hostel" })
        }
        else
        {
            comment.deleteMany({
                _id:{$in: hostel_delete.comments}
                }, function(error){
                if (error)
                {
                    console.log(error);
                    res.status(404).json({ error: "Error in removing hostel" })
                }
                else
                {
                    console.log("comments deleted!");
                }
            });
        }
        return res.status(200).json("hostel deleted");
    });
});


module.exports=router;