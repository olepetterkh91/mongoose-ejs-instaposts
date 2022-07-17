const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const bodyParser = require("body-parser");

const authController = require("./controllers/auth");
const postController = require("./controllers/feed");
const { CONNECT_URL, JWT_SECRET } = require("./constants/constants");

const app = express();
const store = new MongoDBStore({
	uri: CONNECT_URL,
	collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
	session({
		secret: JWT_SECRET,
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/login", (req, res) => {
	res.render("login", { isLoggedIn: req.session.isLoggedIn });
});
app.get("/signup", (req, res) => {
	res.render("signup", { isLoggedIn: req.session.isLoggedIn });
});
app.get("/add-post", (req, res) => {
	res.render("add-post", { isLoggedIn: req.session.isLoggedIn });
});
app.get("/ejs", (req, res) => {
	res.render("index");
});

app.get("/", postController.getPosts);
app.get("/user/:userId", authController.getUser);

app.post("/login", authController.login);
app.post("/signup", authController.signup);
app.post("/logout", authController.logout);
app.post("/add-post", postController.addPost);
app.post("/remove-post/:postId", postController.deletePost);

mongoose
	.connect(CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(process.env.PORT || 3000);
	})
	.catch((error) => {
		console.log(error);
	});
