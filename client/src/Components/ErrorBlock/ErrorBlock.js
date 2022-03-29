import React from "react";
import { connect } from "react-redux";
import "./ErrorBlock.css";

class ErrorBlock extends React.Component {
	renderError = () => {
		return (
			<div className="error-container">
				<h1 className="error-heading">Error</h1>
				<h4 className="error-message">{this.props.message}</h4>
			</div>
		);
	};
	render() {
		return <>{this.props.message ? this.renderError() : null}</>;
	}
}
const mapStateToProps = (state) => {
	return {
		message: state.error,
	};
};

export default connect(mapStateToProps)(ErrorBlock);
