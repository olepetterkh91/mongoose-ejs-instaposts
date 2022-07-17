const User = require("../models/user");
const Post = require("../models/post");

const bcrypt = require("bcryptjs");
const { JWT_SECRET, DEFAULT_AVATAR } = require("../constants/constants");

exports.signup = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	const avatar = req.body.avatar || DEFAULT_AVATAR;
	User.findOne({ email: email })
		.then((user) => {
			if (user) {
				return res.redirect("/signup");
			}
			return bcrypt.hash(password, 12);
		})
		.then((hashedPassword) => {
			const newUser = new User({
				avatar: avatar,
				name: name,
				email: email,
				password: hashedPassword,
				status: "subscriber",
			});
			return newUser.save();
		})
		.then((result) => {
			res.redirect("/login");
		})
		.catch((err) => {
			console.log(err);
			res.redirect("/signup");
		});
};

exports.login = (req, res) => {
	console.log(req.body);
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email }).then((user) => {
		if (!user) {
			return res.redirect("/login");
		}
		bcrypt.compare(password, user.password).then((result) => {
			if (result) {
				req.session.isLoggedIn = true;
				const loggedInUser = {
					_id: user._id,
					userId: user._id,
					name: user.name,
					avatar:
						user.avatar ||
						"https://progitek.no/privat/bp/wp-content/uploads/2020/06/2560px-Aurora_Borealis_activity_on_top_of_the_Kirkjufell_mountain_in_September_2018-768x549.jpg",
				};
				req.session.user = loggedInUser;
				return req.session.save((err) => {
					res.redirect("/");
				});
			}
			res.redirect("/login");
		});
	});
};

exports.logout = (req, res) => {
	req.session.destroy();
	res.redirect("/login");
};

exports.getUser = (req, res) => {
	const userId = req.params.userId;
	User.find({ _id: userId }).then((user) => {
		Post.find({ userId: userId }).then((posts) => {
			res.render("user", {
				posts: posts,
				isLoggedIn: req.session.isLoggedIn,
			});
		});
	});
};
