const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");

// Register POST route
router.post("/register", async (req, res) => {
    try {
        let temp = new user({ username: req.body.username });
        const registeredUser = await user.register(temp, req.body.password);
        
        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Error logging in user:", err);
                return res.status(400).json({ error: "Not able to log in the user after registration" });
            }
            return res.status(200).json({ message: "Registered Successfully", user: registeredUser });
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(400).json({ error: "Not able to register the user" });
    }
});

// Login POST route
router.post("/login", async (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ error: "Invalid username or password" });

        req.logIn(user, async (err) => {
            if (err) return next(err);

            try {
                // Generate JWT
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });
                return res.status(200).json({ message: "Logged in Successfully", username: user.username, token });
            } catch (error) {
                console.error("JWT generation error:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    })(req, res, next);
});

// Logout GET route
router.get("/logout", middleware.isLoggedIn, async (req, res) => {
    req.logout((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.status(400).json({ error: "Issue in logging out" });
        }
        return res.status(200).json({ message: "Logged out" });
    });
});

module.exports = router;
