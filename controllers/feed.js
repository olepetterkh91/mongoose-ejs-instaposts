const Post = require("../models/post");

exports.getPosts = (req, res) => {
	console.log(req.session);
	Post.find()
		.sort({ createdAt: -1 })
		.then((posts) => {
			res.render("posts", {
				posts: posts,
				isLoggedIn: req.session.isLoggedIn,
			});
		});
};

exports.addPost = (req, res) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	const title = req.body.title;
	const imageUrl = req.body.image;
	const body = req.body.content;
	const location = req.body.location;
	const author = {
		name: req.session.user.name,
		userId: req.session.user.userId,
		avatar: req.session.user.avatar,
	};

	console.log(req.body);

	const post = new Post({
		title: title,
		body: body,
		imageUrl: imageUrl,
		author: author,
		location: location,
		createdAt: new Date().toISOString(),
		userId: req.session.user.userId,
	});
	post.save()
		.then((result) => {
			res.redirect("/");
		})
		.catch((err) => {
			console.log(err.errors);
			res.redirect("/add-post");
		});
};

exports.deletePost = (req, res) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	const postId = req.params.postId;
	const userId = req.session.user.userId;

	Post.findById(postId).then((post) => {
		console.log(post);

		if (userId.toString() !== post.userId) {
			console.log(userId, post.userId);
			return res.redirect("/");
		}
		Post.findByIdAndRemove(postId)
			.then(() => res.redirect("/"))
			.catch((err) => {
				console.log(err);
				res.redirect(`/`);
			});
	});
};
