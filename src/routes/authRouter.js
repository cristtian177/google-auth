const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const router = express();

router.use(express.json());

router.get("/", (req, res) => {
    res.send('AQUI OPCION DE LOGIN CON USUARIO DE [POSTGRESS O GOOGLE] -- SINGUP')
  });

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/auth/proteced",
  failureRedirect: "/auth/google/failure",
}));

router.get("/proteced", isLoggedIn, (req, res) => {
  const user = req.user;
  // Genera un JWT con la información del usuario del auth
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json(token);
});

router.get("/google/failure", isLoggedIn, (req, res) => {
  res.send("Something went wrong");
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.send('See you again');
});

module.exports = router ;

