import axios from "axios";
import React, { useState } from "react";

import Head from "next/head";

import style from "../styles/App";

import Author from "../api/Author";
import Commentary from "../api/Commentary";

import CommentList from "../components/CommentList";
import CommentTextBox from "../components/CommentTextBox";

const Home = (props) => {

	const currentUser = new Author(props.data.displayName || props.data.login, props.data.avatarURL, props.data.profileURL);
	const [commentsState, setComments] = useState(props.comments || []);

	function handlePostCommentary(text) {
		if (text.trim()) {
			const timestamp = new Date();
			const newComment = new Commentary(currentUser, text, timestamp);

			axios.post("/send/comment", {
				comment: text,
				userID: props.data.userID
			}).then(() => {
				setComments([...commentsState, newComment]);
				// scrollbar.scrollTop();
				window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
			});
		}
	}

	return (
		<div className="home-container">
			<Head>
				<title>Home</title>
			</Head>

			{currentUser ? (
				<div>
					<CommentTextBox currentUser={currentUser} handleSubmit={handlePostCommentary} />
					<CommentList comments={commentsState} />
				</div>
			) : (
					<h1>Realize o login</h1>
				)}

			<style jsx>{style}</style>
		</div>
	);
}

Home.getInitialProps = ({ query }) => {
	return { ...query };
};

export default Home;