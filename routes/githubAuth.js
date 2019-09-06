const axios = require("axios");

const UserModel = require("../models/UserModel");
const CommentaryModel = require("../models/CommentaryModel");

const HOST = "https://comenty.herokuapp.com";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_CALLBACK_URI = `${HOST}/login/github/callback`;

let states = [];

// nossa porta de entrada =]
module.exports.login = async (req, res) => {
	console.log("***************************", "pass 1", "***************************")
	const rand = () => {
		return Math.random().toString(36).substr(2);
	};
	const generateToken = () => {
		return rand() + rand();
	};

	const token = generateToken();
	console.log("***************************", "pass 2", token, "***************************")

	states.push(token);
	res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_CALLBACK_URI}&scope=user:email&state=${token}`);
};

// github ira nos chamar por aqui [=
module.exports.callback = async (req, res) => {
	console.log("***************************", "pass 3", "***************************")

	const tokenIndex = states.indexOf(req.query.state);

	console.log("***************************", "pass 4", tokenIndex, "***************************")
	if (tokenIndex < 0) {
		console.log("***************************", "pass 5", req.query.state, "***************************")
		return res.redirect("/login");
	}
	else {
		console.log("***************************", "pass 6a", states.length, "***************************")

		states.splice(tokenIndex, 1);

		console.log("***************************", "pass 6b", states.length, "***************************")
		// states = states.filter(e => e !== req.query.state);
	}

	const params = {
		client_id: GITHUB_CLIENT_ID,
		client_secret: GITHUB_CLIENT_SECRET,
		// redirect_uri: "http://localhost:3000/login/github/callback", // URL que eu configurei no app
		code: req.query.code,
		state: req.query.state
	};

	const token_response = await axios.post("https://github.com/login/oauth/access_token", params);

	const urlParams = new URLSearchParams(token_response.data);

	const ACCESS_TOKEN = urlParams.get("access_token");

	console.log("***************************", "pass 7", ACCESS_TOKEN, "***************************")

	const AuthStr = "Bearer ".concat(ACCESS_TOKEN);

	const OAuthRequestConfig = { headers: { Authorization: AuthStr } };

	const user_response = await axios.get("https://api.github.com/user", OAuthRequestConfig);

	const { email, id, login, name: displayName, html_url, avatar_url } = user_response.data;

	console.log("***************************", "pass 8", user_response.data, "***************************")

	const userExists = await UserModel.findOne({ id });

	console.log("***************************", "pass 9", userExists, "***************************")

	const cookieData = {
		email,
		ACCESS_TOKEN
	};

	res.cookie("COMENTY_SESSION", cookieData, { maxAge: 24 * 60 * 60 * 1000 });

	if (!userExists) {
		console.log("***************************", "pass 10", email, "***************************")

		try {
			const dev = await UserModel.create({
				email,
				id,
				login,
				displayName,
				profileURL: html_url,
				avatarURL: avatar_url,
			});
		}
		catch (error) {
			console.error(`Usuário não criado: ID:${id}, login:${login}, details:`, error);
		}
	}

	res.redirect("/home");
};

// verificamos a existência do 
module.exports.verifySession = async (app, req, res) => {
	const cookie = req.cookies.COMENTY_SESSION;

	console.log("========================", "pass 1", "========================");
	if (cookie && cookie.ACCESS_TOKEN) {
		try {
			console.log("========================", "pass 2", "========================");

			const ACCESS_TOKEN = cookie.ACCESS_TOKEN;
			const AuthStr = "Bearer ".concat(ACCESS_TOKEN);
			const OAuthRequestConfig = { headers: { Authorization: AuthStr } };
			const github = await axios.get("https://api.github.com/user", OAuthRequestConfig);

			console.log("========================", "pass 2", github.data.name, "========================");

			const USERDATA = {
				token: ACCESS_TOKEN,
				userID: github.data.id,
				login: github.data.login,
				displayName: github.data.name,
				avatarURL: github.data.avatar_url,
				profileURL: github.data.html_url
			};

			const commentsDB = await CommentaryModel.find({});

			console.log("========================", "pass 3", commentsDB, "========================");

			let comments = [];

			const asyncForEach = async (array, callback) => {
				for (let index = 0; index < array.length; index++) {
					await callback(array[index], index, array);
				}
			}

			await asyncForEach(commentsDB, async (commentDB) => {
				const authorDB = await UserModel.findOne({ id: commentDB.userID });

				if (authorDB) {
					const author = { name: authorDB.displayName || authorDB.login, avatarURL: authorDB.avatarURL, url: authorDB.profileURL }
					const comment = { author, text: commentDB.comment, timestamp: commentDB.createdAt };

					comments.push(comment);
				} else {
					// throw new Error();
					console.error(`Usuário não encontrado: ${commentDB.userID}`);
				}
			});

			console.log("========================", "pass 4", comments, "========================");

			return app.render(req, res, "/home", { data: USERDATA, comments })
		}
		catch (error) {
			console.error("========================", "pass 5 ERROR", error, "========================");
			return app.render(req, res, "/login", req.query)
		}
	}
	else {
		console.log("========================", "pass 7", "========================");
		return app.render(req, res, "/login", req.query)
	}
};
