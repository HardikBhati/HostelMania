const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");

// register-get route
router.get("/register", function(req, res) {
    res.render("register");
});

// register-post route
router.post("/register", function(req, res) {
    let temp = new user({ username: req.body.username });
    user.register(temp, req.body.password, function(error, user) {
        if (error) {
            req.flash("error", error.message);
            console.log(error);
            return res.status(400).json({ error: "Not able register the user"});
        }
        passport.authenticate("local")(req, res, function() {
            return res.status(200).json({ message: "Registered Successfully", user: user });
        });
    });
});


router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        console.log("user", user)
        if (err) return next(err);
        if (!user) return res.status(400).json({ error: "Invalid username or password" });

        req.logIn(user, (err) => {
            if (err) return next(err);

            // Generate JWT
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

        return res.status(200).json({ message: "logged in Successfully", username: user.username, token:token });
        });
    })(req, res, next);
});

// logout route
router.get("/logout", function(req, res) {
    req.logout(function(error) {
        if (error) {
            console.log(error);
            return res.status(400).json({ error: "Issue in logging out"});
        }
        return res.status(200).json({ message: "logged out", user: user });
    });
});

module.exports = router;
