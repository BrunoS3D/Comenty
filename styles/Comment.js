import css from 'styled-jsx/css';

export default css`
.comment-container {
	display: flex;
	margin: 5px 0;
	padding: 5px;
	flex-direction: column;
	background: #f0f2f3;
	border-radius: 20px;
}

.author-container {
	display: flex;
	flex-direction: row;
}

.author-name {
	text-decoration: none;
	margin-left: 5px;
	font-size: 16px;
	color: #196cb1;
}

.comment-timestamp {
	margin-left: 5px;
	margin-top: 3px;
	font-size: 12px;
	color: #8d8d8d;
}

.comment-text {
	word-wrap: break-word;
	margin: 0;
	margin-top: -15px;
	margin-left: 40px;
	font-size: 15px;
	color: #383838;
}
`;