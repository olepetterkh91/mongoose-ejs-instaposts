const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { CONNECT_URL, JWT_SECRET } = require("./constants/constants");

const app = express();

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: false,
		},
		author: {
			type: Object,
			required: true,
		},
	},
	{ timestamps: true }
);

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
	const Post = mongoose.model("InstaPost", postSchema);
	Post.find().then((posts) => {
		res.render("posts", { posts: posts });
	});
});

mongoose
	.connect(CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(process.env.PORT || 3000);
	})
	.catch((error) => {
		console.log(error);
	});
