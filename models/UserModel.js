const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	profileURL: {
		type: String,
		required: true,
	},
	avatarURL: {
		type: String,
		required: true,
	},
}, { timestamps: true, });

module.exports = model("UserModel", UserSchema);
// createdAt, updatedAt