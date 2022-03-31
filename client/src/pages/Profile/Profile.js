import React from "react";
import { connect } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getMe, errorShow, getUserCache } from "../../actions";
import history from "../../history";
import Topbar from "../../Components/Topbar/Topbar";
import "./Profile.css";
class Profile extends React.Component {
	componentDidMount() {
		if (
			!this.props.isLoggedIn &&
			this.props.location.pathname === "/profile"
		) {
			this.props.errorShow(401, "Login required");
			history.push("/login");
		}
		if (this.props.location.pathname === "/profile") {
			this.props.getMe();
		}
		if (this.props.match.params.user && !this.props.isLoggedIn) {
			this.props.getUserCache(this.props.match.params.user);
		}
		if (this.props.match.params.user && this.props.isLoggedIn) {
			this.props.getMe();
			this.props.getUserCache(this.props.match.params.user);
		}
	}
	renderProfileButton = () => {
		if (
			this.props.user.username === this.props.match.params.user ||
			this.props.user._id === this.props.match.params.user
		)
			return (
				<button className="profile-form-button">
					<AddIcon />
					Follow
				</button>
			);
		else return <button className="profile-form-button">Edit</button>;
	};
	renderUserDetails = () => {
		if (this.props.user)
			return (
				<div className="user-details">
					<ul className="grid">
						<li className="grid-item" id="username" key="username">
							{this.props.user.username}
							<hr />
						</li>
						<li className="grid-item" id="age" key="age">
							<div className="profile-key">Age</div>
							<hr />
							<div className="profile-value">
								{this.props.user.age || "unspecified"}
							</div>
						</li>
						<li className="grid-item" id="email" key="email">
							<p>{this.props.user.email}</p>
						</li>
						<li
							className="grid-item"
							id="followers"
							key="followers"
						>
							<div className="profile-key">Followers</div>
							<hr />
							<div className="profile-value">
								{this.props.user.followers?.length || 0}
							</div>
						</li>
						<li
							className="grid-item"
							id="following"
							key="following"
						>
							<div className="profile-key">Following</div>
							<hr />
							<div className="profile-value">
								{this.props.user.following?.length || 0}
							</div>
						</li>
						<li className="grid-item" id="about" key="about">
							<h1>About</h1>
							<p className="about">
								{this.props.user.about ||
									"user did not specify anything about "}
							</p>
						</li>
						<li className="grid-item" id="country" key="country">
							<div className="profile-key">Country</div>
							<hr />
							<div className="profile-value">
								{this.props.user.country || "unspecified"}
							</div>
						</li>
						<li
							className="grid-item"
							id="relationship"
							key="relationship"
						>
							<div className="profile-key">Relationship</div>
							<hr />
							<div className="profile-value">
								{this.props.user.relationship || "unspecified"}
							</div>
						</li>
						{this.props.isLoggedIn
							? this.renderProfileButton()
							: null}
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

const mapStateToProps = (state, ownProps) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		user:
			history.location.pathname === "/profile"
				? state.user["me"]
				: state.cacheUser,
		me: state.user["me"],
	};
};

export default connect(mapStateToProps, {
	errorShow,
	getUserCache,
	getMe,
})(Profile);
