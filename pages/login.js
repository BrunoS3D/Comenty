import React from "react";
import Link from "next/link";

import style from "../styles/Login";

export default function Login() {

	function loginHandler() {
		// direciona o navegador para a pagina /main
		// window.location = "/login/github";
		// history.push("login/github"); // quando tiver online
	}

	return (
		<div className="login-container">
			<div className="login-form">
				<div className="login-content">
					<img className="login-logo" src="/static/icon.png" alt="logo" />
					<Link href="/login/github">
						<button className="login-button" onClick={loginHandler} type="button">
							<img className="login-github-logo" src="/static/GitHub-Mark-Light-32px.png" alt="github-logo" />
							<span className="login-github-text">Login with GitHub</span>
						</button>
					</Link>
				</div>
			</div>

			<style jsx>{style}</style>
		</div>
	);
}
