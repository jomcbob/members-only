require('dotenv').config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const path = require("node:path");
const { loginRouter } = require("./routes/loginRouter");
const { logoutRouter } = require("./routes/logoutRouter");
const { signupRouter } = require("./routes/signupRouter");
const pool = require("./db/pool");
const { getMessages } = require("./db/queries");
const { messageRouter } = require('./routes/messageRouter');
const { isAuthenticated, isAdmin } = require("./controllers/loginController")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get("/", async (req, res) => {
  res.render("index", { title: "Home Page", messages: await getMessages() });
});
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/signup", signupRouter);
app.use("/messages", isAuthenticated, messageRouter);
app.get('/{*splat}', (req, res, next) => {
  const err = new Error(`Page not found: ${req.originalUrl}`);
  err.statusCode = 404
  next(err)
});

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render('error', { title: 'Error', error: err});
});
