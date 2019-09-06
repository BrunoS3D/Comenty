import React from "react";

import style from "../styles/Comment";

import Comment from "./Comment";

export default function CommentList(props) {
	return (
		<div className="comment-list-container">
			{props.comments.map((comment, index) => (
				<Comment comment={comment} key={index} />
			))}

			<style jsx>{style}</style>
		</div>
	);
}
