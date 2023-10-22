const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const app = express();

require("./auth");

app.use(express.json());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/auth/proteced",
  failureRedirect: "/auth/google/failure",
}));

app.get("/auth/proteced", isLoggedIn, (req, res) => {
  const user = req.user;
  // Genera un JWT con la información del usuario del auth
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json(token);
});

app.get("/auth/google/failure", isLoggedIn, (req, res) => {
  res.send("Something went wrong");
});

app.get("/auth/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.send('See you again');
});

app.listen(5000, console.log("Listening on port 5000"));
