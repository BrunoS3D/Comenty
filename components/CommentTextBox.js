import React, { useState } from 'react';

import avatar from "../styles/Avatar";
import style from "../styles/CommentTextBox";

export default function CommentTextBox(props) {
	const [text, setText] = useState("");

	function handleSubmit(e) {
		e.preventDefault();

		props.handleSubmit(text);

		setText("");
	}

	return (
		<div className="comment-text-box-container">
			<img className="author-avatar" src={props.currentUser.avatarURL} alt={props.currentUser.name} />
			<form className="comment-text-box-form" onSubmit={handleSubmit}>
				<input
					className="comment-text-box-input"
					placeholder="Deixe um comentário..."
					value={text}
					onChange={e => setText(e.target.value)}
				/>
				{/* <button type="submit">Enviar</button> */}
			</form>

			<style jsx>{style}</style>
			<style jsx>{avatar}</style>
		</div>
	);
}
