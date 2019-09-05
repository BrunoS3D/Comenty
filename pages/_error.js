import React from "react";

class Error extends React.Component {

	static getInitialProps({ res, error }) {
		const statusCode = res ? res.statusCode : error ? error.statusCode : null;
		return { statusCode };
	}

	render() {
		return (
			<p>
				{
					this.props.statusCode
						// if ^
						? `An error ${this.props.statusCode} occurred on server`
						// else
						: "An error occurred on client"
				}
			</p>
		)
	}
}

export default Error;