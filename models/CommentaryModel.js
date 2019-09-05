const { Schema, model } = require("mongoose");

const CommentarySchema = new Schema({
	userID: {
		type: String,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
}, { timestamps: true, });

module.exports = model("CommentaryModel", CommentarySchema);
// createdAt, updatedAt