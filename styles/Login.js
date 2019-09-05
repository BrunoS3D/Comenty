import css from 'styled-jsx/css';

export default css`
.login-container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background: #ececec;
}

.login-form {
	width: 350px;
	background: #fff;
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 2px 10px #cecece;
}

.login-content {
	width: 100%;
	height: 100%;
	padding: 40% 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-items: center;
}

.login-logo {
	width: 64px;
	height: 64px;
	border-radius: 50%;
	box-shadow: 0 2px 10px #cecece;
}

.login-logo:hover {
	box-shadow: none;
}

.login-button {
	display: flex;
	flex-direction: row;
	height: 44px;
	margin: 10px 0;
	padding: 10px 20px;
	/* TESTE */
	cursor: pointer;
	background-color: #13aa52;
	background-image: linear-gradient(#13aa52, #18964c);
	box-shadow: #00000026 0px -1px 0px inset;
	border-width: 1px;
	border-style: solid;
	border-image: initial;
	border-radius: 3px;
	text-decoration: none;
	border-color: #12a14e;
}

.login-button:hover {
	background-image: linear-gradient(#13753c, #0d6934);
}

.login-github-text {
	font-size: 18px;
	color: #ffffff;
	padding-left: 10px;
}

.login-github-logo {
	height: 24px;
	padding-right: 10px;
	border-right: thin solid #808080;
}
`;