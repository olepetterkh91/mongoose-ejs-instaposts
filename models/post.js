const mongoose = require("mongoose");
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
		userId: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("InstaPost", postSchema);
