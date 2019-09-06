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
	const rand = () => {
		return Math.random().toString(36).substr(2);
	};
	const generateToken = () => {
		return rand() + rand();
	};

	const token = generateToken();

	states.push(token);
	res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_CALLBACK_URI}&scope=user:email&state=${token}`);
};

// github ira nos chamar por aqui [=
module.exports.callback = async (req, res) => {

	const tokenIndex = states.indexOf(req.query.state)

	if (tokenIndex > -1) {
		states.splice(tokenIndex, 1);
		// states = states.filter(e => e !== req.query.state);
		return res.redirect("/login");
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

	const AuthStr = "Bearer ".concat(ACCESS_TOKEN);

	const OAuthRequestConfig = { headers: { Authorization: AuthStr } };

	const user_response = await axios.get("https://api.github.com/user", OAuthRequestConfig);

	const { email, id, login: username, name: displayName, html_url, avatar_url } = user_response.data;

	const userExists = await UserModel.findOne({ email });

	const cookieData = {
		email,
		ACCESS_TOKEN
	};

	res.cookie("COMENTY_SESSION", cookieData, { maxAge: 24 * 60 * 60 * 1000 });

	if (!userExists) {
		const dev = await UserModel.create({
			email,
			id,
			username,
			displayName,
			profileURL: html_url,
			avatarURL: avatar_url,
		});
	}

	res.redirect("/home");
};

// verificamos a existência do 
module.exports.verifySession = async (app, req, res) => {
	const cookie = req.cookies.COMENTY_SESSION;

	if (cookie && cookie.ACCESS_TOKEN) {
		// console.log("pass 1");
		try {
			const ACCESS_TOKEN = cookie.ACCESS_TOKEN;
			const AuthStr = "Bearer ".concat(ACCESS_TOKEN);
			const OAuthRequestConfig = { headers: { Authorization: AuthStr } };
			const github = await axios.get("https://api.github.com/user", OAuthRequestConfig);

			// console.log("pass 2", github.data.name);

			const USERDATA = {
				token: ACCESS_TOKEN,
				userID: github.data.id,
				login: github.data.login,
				displayName: github.data.name,
				avatarURL: github.data.avatar_url,
				profileURL: github.data.html_url
			};

			const commentsDB = await CommentaryModel.find({});

			// console.log("pass 3", commentsDB);

			let comments = [];

			const asyncForEach = async (array, callback) => {
				for (let index = 0; index < array.length; index++) {
					await callback(array[index], index, array);
				}
			}

			await asyncForEach(commentsDB, async (commentDB) => {
				const authorDB = await UserModel.findOne({ id: commentDB.userID });

				const author = { name: authorDB.displayName, avatarURL: authorDB.avatarURL, url: authorDB.profileURL }
				const comment = { author, text: commentDB.comment, timestamp: commentDB.createdAt };

				comments.push(comment);
			});

			// console.log("pass 4", comments);

			return app.render(req, res, "/home", { data: USERDATA, comments })
		}
		catch {
			return app.render(req, res, "/login", req.query)
		}
	}
	else {
		return app.render(req, res, "/login", req.query)
	}
};
