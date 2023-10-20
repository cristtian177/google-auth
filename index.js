const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const app = express();

require("./auth");

app.use(express.json());


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use( session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session())

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protec",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/protec", isLoggedIn, (req, res) => {
  //let name = req.user;
  //res.send(`Hello ${name}`);
  // Accede al objeto del usuario directamente
  let user = req.user;

  // Convierte el objeto en una cadena JSON y envíala
  res.send(user);

});

app.get("/auth/google/failure", isLoggedIn, (req, res) => {
  res.send("Something went wrong");
});

app.get("/auth/logout", isLoggedIn, (req, res) => {
  req.session.destroy()
  res.send('see you again')
});


app.listen(5000, console.log("Listening on port 5000"));
