import React from "react";
import ReactDOM from "react-dom";

import "./createConversation.css";

class CreateConversation extends React.Component {
	render() {
		return ReactDOM.createPortal(
			<div className="cc-container">
				<div className="cc-form">form</div>
			</div>,
			document.getElementById("modal")
		);
	}
}

export default CreateConversation;
