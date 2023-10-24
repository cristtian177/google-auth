const express = require("express");
const app = express()

require('./database')

require("./middleware/auth");

const userRuoter = require('./routes/userRouter')
app.use('/user', userRuoter);

const authRuoter = require('./routes/authRouter')
app.use('/auth', authRuoter);

app.listen(5000, console.log("Listening on port 5000"));
