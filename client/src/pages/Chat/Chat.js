import React from "react";
import "./chat.css";

import { CircularProgress } from "@mui/material";
class Chat extends React.Component {
	render() {
		return (
			<div className="chat-container">
				<div className="circular">
					<CircularProgress />
				</div>
			</div>
		);
	}
}
export default Chat;
