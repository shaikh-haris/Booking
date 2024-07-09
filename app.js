if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

const ExpressError = require("./utils/ExpressError");

const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const db_URL = process.env.ATLASBD_URL;
const secret = process.env.SECRET

// use ejs-mate for all ejs templates:
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: db_URL,
  crypto: {
    secret :secret
  },
  touchAfter: 24 * 3600,
})

store.on("error", ()=>{
  console.log("ERROR in mongo session store", err)
})

const sessionOption = {
  store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(res.locals.success);
  // console.log(res.locals.success);
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Connect to the database
async function main() {
  await mongoose.connect(db_URL);
}
main()
  .then(() => {
    console.log("Connect successful ....");
  })
  .catch((err) => console.log(err));

// Error handling for all other routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found 😊"));
});

// Middleware Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
