import React from "react";
import { connect } from "react-redux";
import Topbar from "../../Components/Topbar/Topbar";
import "./Profile.css";
class Profile extends React.Component {
	renderUserDetails = () => {
		return (
			<div className="user-details">
				<ul className="grid">
					<li
						className="grid-item noProperty"
						id="username"
						key="username"
					>
						{this.props.user.username}
						<span id="small-username">
							Age {this.props.user.age || "unknown"}
						</span>
					</li>
					<li className="grid-item noProperty" id="email" key="email">
						<p className="profile-key">e-mail |</p>
						<p className="profile-value">{this.props.user.email}</p>
					</li>
					<li className="grid-item" id="followers" key="followers">
						<p className="profile-key">Followers |</p>
						<p className="profile-value">
							{this.props.user.followers?.length || 0}
						</p>
					</li>
					<li className="grid-item" id="following" key="following">
						<p className="profile-key">Following |</p>
						<p className="profile-value">
							{this.props.user.following?.length || 0}
						</p>
					</li>
					<li className="grid-item noProperty" id="about" key="about">
						<h2>About</h2>
						<p className="profile-value">
							{this.props.user.about ||
								"you did not specify something about you"}
						</p>
					</li>
					<li className="grid-item" id="country" key="country">
						<p className="profile-key">Country |</p>
						<p className="profile-value">
							{this.props.user.country || "unknown"}
						</p>
					</li>
					<li
						className="grid-item"
						id="relationship"
						key="relationship"
					>
						<p className="profile-key">Relationship |</p>
						<p className="profile-value">
							{this.props.user.relationship || "unspecified"}
						</p>
					</li>
					<button className="profile-form-button">
						Follow/unfollow
					</button>
				</ul>
			</div>
		);
	};

	renderCoverPic = () => {
		return (
			<>
				<div className="border-cover-section"></div>
				<div
					className="cover-section"
					style={{
						backgroundImage: `url(${
							process.env.PUBLIC_URL
						}/images/${
							this.props.user
								? this.props.user.coverPicture
								: "home-cover.png"
						})`,
						backgroundSize: "100vw",
						backgroundPosition: "center",
					}}
				></div>
			</>
		);
	};
	renderProfilePic = () => {
		return (
			<img
				className="user-profile-image"
				src={`${process.env.PUBLIC_URL}/images/${
					this.props.user
						? this.props.user.profilePicture
						: "default.jpg"
				}`}
				alt="profile"
			></img>
		);
	};
	render() {
		return (
			<div className="userprofile-container">
				<Topbar />
				<div className="user-box">
					{this.renderCoverPic()}
					{this.renderProfilePic()}
					{this.renderUserDetails()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		user: null,
	};
};

export default connect(mapStateToProps)(Profile);
