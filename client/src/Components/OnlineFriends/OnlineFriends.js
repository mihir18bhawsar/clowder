import React from "react";
import FriendCapsule from "../FriendCapsule/FriendCapsule";
import "./onlineFriends.css";

class OnlineFriends extends React.Component {
	renderList = () => {
		return (
			<>
				<li>
					<FriendCapsule />
				</li>
				<li>
					<FriendCapsule />
				</li>
			</>
		);
	};
	render() {
		return (
			<div className="of-container">
				<div className="sidebar-title">Online Friends</div>
				<hr />
				<ul>{this.renderList()}</ul>
			</div>
		);
	}
}
export default OnlineFriends;
