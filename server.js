const next = require("next");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// const { parse } = require("url");
const githubAuth = require("./routes/githubAuth");

const CommentaryModel = require("./models/CommentaryModel");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


// Heroku Config

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;


mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true
});

app.prepare().then(() => {
	const server = express();

	server.use(express.json());
	server.use(cors());
	// ativa os cookies (req.cookies)
	server.use(cookieParser());

	// github application auth
	server.get("/login/github", githubAuth.login);

	// github application auth callback
	server.get("/login/github/callback", githubAuth.callback);

	// github application verifica a sessao atual atraves dos cookies
	server.get("/", async (req, res) => { await githubAuth.verifySession(app, req, res) });
	server.get("/home", async (req, res) => { await githubAuth.verifySession(app, req, res) });
	server.get("/login", async (req, res) => { await githubAuth.verifySession(app, req, res) });

	server.post("/send/comment", async (req, res) => {
		const { userID, comment } = req.body;

		const newComment = await CommentaryModel.create({
			userID,
			comment,
		});

		return res.json(newComment);
	});

	server.get("*", (req, res) => {
		return handle(req, res);
	});

	server.listen(PORT, (error) => {
		if (error) throw error;
		console.log(`> Ready on ${PORT}`);
	});
});
