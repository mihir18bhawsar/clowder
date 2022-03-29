import React from "react";
import { connect } from "react-redux";
import "./MessageBlock.css";

class MessageBlock extends React.Component {
	renderMessage = () => {
		return (
			<div className="message-container">
				<h1 className="message-heading">Message</h1>
				<h4 className="message-message">{this.props.message}</h4>
			</div>
		);
	};
	render() {
		return <>{this.props.message ? this.renderMessage() : null}</>;
	}
}
const mapStateToProps = (state) => {
	return {
		message: state.message,
	};
};

export default connect(mapStateToProps)(MessageBlock);
