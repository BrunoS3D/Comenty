import React from 'react';

import style from "../styles/Comment";
import avatar from "../styles/Avatar";

export default function Comment(props) {
	return (
		<div className="comment-container">
			<header className="author-container">
				<img className="author-avatar" src={props.comment.author.avatarURL} alt={props.comment.author.name} />
				<a className="author-name" href={props.comment.author.url}>
					{props.comment.author.name}
				</a>
				<span className="comment-timestamp">{props.comment.timestamp.toString().substring(0, 10)}</span>
			</header>
			<footer>
				<p className="comment-text">
					{props.comment.text}
				</p>
			</footer>

			<style jsx>{style}</style>
			<style jsx>{avatar}</style>
		</div>
	);
}