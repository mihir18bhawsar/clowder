import React from "react";
import { connect } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import "./FriendCapsule.css";
import { follow, unfollow } from "../../actions";
class FriendCapsule extends React.Component {
	handleFollow = () => {
		this.props.follow(this.props.user._id);
	};
	handleUnfollow = () => {
		this.props.unfollow(this.props.user._id);
	};
	render() {
		if (this.props.user.disabled) return null;
		return (
			<div className="capsule-container">
				<div className="profileContainer">
					<img
						src={
							process.env.PUBLIC_URL +
							`/images/${
								this.props.user.profilePicture || "default.jpg"
							}`
						}
						alt="profile"
					/>
				</div>
				<div className="friendName">{this.props.user.username}</div>

				{this.props.me.following.includes(this.props.user._id) ? (
					<PersonRemoveIcon
						className="mini-post-buttons"
						onClick={this.handleUnfollow}
					/>
				) : (
					<PersonAddIcon
						className="mini-post-buttons"
						onClick={this.handleFollow}
					/>
				)}
			</div>
		);
	}
}
export default connect(null, { follow, unfollow })(FriendCapsule);
