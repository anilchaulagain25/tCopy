var createError = require("http-errors");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var clipboardRouter = require("./routes/clipboard");
var authRouter = require("./routes/auth");

const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
require("dotenv").config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./shared/layout");
app.set("layout extractScripts", true);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_AUTH_CLIENTID,
      clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_AUTH_CLIENT_CALLBACKURL,
      profileFields: ["displayName", "emails"], // email should be in the scope.
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_AUTH_CLIENTID,
      consumerSecret: process.env.TWITTER_AUTH_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_AUTH_CLIENT_CALLBACKURL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", clipboardRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const env = app.get("env");
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  err.env = env;
  res.locals.error = err.env === "development" ? err : {};

  // render the error page
  err.status = err.status || 500;
  res.status(err.status);
  res.render("error");
});

module.exports = app;
