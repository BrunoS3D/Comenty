import css from 'styled-jsx/css';

export default css`
.comment-text-box-container {
	display: flex;
	flex-direction: row;
	padding: 5px;
	background: #f0f2f3;
	border-radius: 20px;
	border: 1px solid #d3d3d3;
}

.comment-text-box-form {
	display: block;
	flex: 1;
	margin: 0 5px;
	display: flex;
}

.comment-text-box-input {
	/* max-height: 60px; */
	flex: 1;
	resize: vertical;
	box-sizing: border-box;
	padding: 7px 15px;
	min-height: 32px;
	outline: none;
	border-radius: 20px;
	border: 1px solid #d3d3d3;
}
`;