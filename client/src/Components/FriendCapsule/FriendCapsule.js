import React from "react";
import "./FriendCapsule.css";
export default function FriendCapsule() {
	return (
		<div className="capsule-container">
			<div className="profileContainer">
				<img
					src={process.env.PUBLIC_URL + "/userimages/default.jpg"}
					alt="profile"
				/>
			</div>
			<div className="friendName">Aditya Yoginath</div>
		</div>
	);
}
