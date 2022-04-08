import React from "react";
import { connect } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
	getMe,
	errorShow,
	getUserCache,
	unfollow,
	follow,
} from "../../actions";
import history from "../../history";
import "./Profile.css";
import EditProfile from "../../Components/Modal/EditProfile/EditProfile";
import { CircularProgress } from "@mui/material";
class Profile extends React.Component {
	_ismounted = false;
	constructor(props) {
		super(props);
		this.state = { EPActive: false, dataReady: false };
	}

	dataLoader = async () => {
		if (this.props.location.pathname === "/profile") {
			await this.props.getMe();
		}
		if (this.props.match.params.user && !this.props.isLoggedIn) {
			await this.props.getUserCache(this.props.match.params.user);
		}
		if (this.props.match.params.user && this.props.isLoggedIn) {
			await this.props.getUserCache(this.props.match.params.user);
			await this.props.getMe();
		}
		if (history.location.pathname === `/profile/${this.props.me.username}`)
			history.push("/profile");
	};
	componentDidMount() {
		this._ismounted = true;
		if (
			!this.props.isLoggedIn &&
			this.props.location.pathname === "/profile"
		) {
			this.props.errorShow(401, "Login required");
			history.push("/login");
		}
		this.dataLoader().then(() => {
			if (this._ismounted) this.setState({ dataReady: true });
		});
	}

	componentDidUpdate(prevProps) {
		if (this.props.match.params.user !== prevProps.match.params.user) {
			if (this._ismounted) this.setState({ dataReady: false });
			this.dataLoader().then(() => {
				if (this._ismounted) this.setState({ dataReady: true });
				if (this.props.match.params.user)
					history.push(`/profile/${this.props.match.params.user}`);
			});
		}
	}

	componentWillUnmount() {
		this._ismounted = false;
	}
	EPToggle = () => {
		this.setState({ EPActive: !this.state.EPActive });
	};

	handleFollowToggle() {
		if (this.props.me.following.includes(this.props.user._id)) {
			this.props.unfollow(this.props.user._id);
		} else {
			this.props.follow(this.props.user._id);
		}
	}
	renderFollowUnfollowButton() {
		if (this.props.me.following.includes(this.props.user._id)) {
			return (
				<>
					<RemoveIcon />
					Unfollow
				</>
			);
		} else {
			return (
				<>
					<AddIcon />
					Follow
				</>
			);
		}
	}

	renderProfileButton = () => {
		if (
			this.props.location.pathname === "/profile" ||
			this.props.match.params.user === this.props.me._id ||
			this.props.match.params.user === this.props.me.username
		) {
			return (
				<>
					<button
						className="profile-form-button"
						onClick={() => this.EPToggle()}
					>
						Edit
					</button>
					{this.state.EPActive ? (
						<EditProfile
							modalToggle={this.EPToggle}
							initialValues={{
								...this.props.me,
								dob: this.props.me.dob?.split("T")[0],
							}}
						/>
					) : null}
				</>
			);
		} else
			return (
				<button
					className="profile-form-button"
					onClick={() => {
						this.handleFollowToggle();
					}}
				>
					{this.renderFollowUnfollowButton()}
				</button>
			);
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
						{this.props.isLoggedIn &&
						this.props.me &&
						!this.props.user.disabled
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
		if (this.state.dataReady)
			return (
				<div className="userprofile-container">
					<div className="user-box">
						{this.renderCoverPic()}
						{this.renderProfilePic()}
						{this.renderUserDetails()}
					</div>
				</div>
			);
		else {
			return (
				<div className="circular">
					<CircularProgress />
				</div>
			);
		}
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
	follow,
	unfollow,
})(Profile);
