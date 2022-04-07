import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import "./FriendCapsule.css";
import { follow, unfollow } from "../../actions";
class FriendCapsule extends React.Component {
	handleFollow = (e) => {
		e.preventDefault();
		this.props.follow(this.props.user._id);
		// e.stopPropagation();
	};
	handleUnfollow = (e) => {
		e.preventDefault();
		this.props.unfollow(this.props.user._id);
		// e.stopPropagation();
	};
	render() {
		if (this.props.user.disabled) return null;
		return (
			<Link
				className="capsule-link expanded"
				to={`/profile/${this.props.user.username}`}
			>
				<div className="capsule-container">
					<div className="profileContainer">
						<img
							src={
								process.env.PUBLIC_URL +
								`/images/${
									this.props.user.profilePicture ||
									"default.jpg"
								}`
							}
							alt="profile"
						/>
					</div>
					<div className="friendName">{this.props.user.username}</div>
					{this.props.chat ? null : this.props.me.following.includes(
							this.props.user._id
					  ) ? (
						<PersonRemoveIcon
							className="mini-post-buttons"
							onClick={(e) => this.handleUnfollow(e)}
						/>
					) : (
						<PersonAddIcon
							className="mini-post-buttons"
							onClick={(e) => this.handleFollow(e)}
						/>
					)}
				</div>
			</Link>
		);
	}
}
export default connect(null, { follow, unfollow })(FriendCapsule);
