const passport = require("passport");
const express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("auth/login.ejs");
});

router.get("/error", isLoggedIn, function (req, res) {
  res.render("auth/error.ejs");
});

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/twitter",
  passport.authenticate("twitter", {
    scope: ["public_profile", "email"],
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/error",
  })
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/error",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
