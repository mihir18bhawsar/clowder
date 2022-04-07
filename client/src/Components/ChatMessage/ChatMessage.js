import React from "react";
import "./chatMessage.css";
class ChatMessage extends React.Component {
	render() {
		return (
			<div className={`chatbox${this.props.own ? "-me" : ""}`}>
				<div
					className={`chatbox-message-area${
						this.props.own ? "-me" : ""
					}`}
				>
					{this.props.text}
				</div>
				<div className="chatbox-details">
					<div className="chatbox-picture"></div>
					<div className="chatbox-sender">{this.props.username}</div>
					<div className="chatbox-time">{this.props.time}</div>
				</div>
			</div>
		);
	}
}

export default ChatMessage;
