import React from "react";
import { Search } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { logout, getMe } from "../../actions";
import { connect } from "react-redux";
import "./topbar.css";

class Topbar extends React.Component {
	componentDidMount() {
		if (this.props.isLoggedIn) this.props.getMe();
	}
	renderAuthenticatedNav = () => {
		return (
			<>
				<Link to="/" className="navLink">
					Feed
				</Link>
				<Link to="/chat" className="navLink">
					Chat
				</Link>
				<Link to="/my-posts" className="navLink">
					My Posts
				</Link>
				<Link to="/" onClick={this.props.logout} className="navLink">
					Logout
				</Link>
			</>
		);
	};
	renderUnauthenticatedNav = () => {
		return (
			<>
				<Link to="/login" className="navLink">
					Login
				</Link>
				<Link to="/register" className="navLink">
					SignUp
				</Link>
			</>
		);
	};
	renderNavigationBar = () => {
		return (
			<div className="navigationContainer">
				{this.props.isLoggedIn
					? this.renderAuthenticatedNav()
					: this.renderUnauthenticatedNav()}
			</div>
		);
	};
	renderSearchBar = () => {
		return (
			<div className="search">
				<div className="searchbar">
					<Search className="searchIcon" />
					<input
						placeholder="Search for Friends"
						className="searchInput"
					/>
				</div>
			</div>
		);
	};
	renderProfile = () => {
		let profilePicPath;
		if (this.props.me) {
			profilePicPath =
				process.env.PUBLIC_URL +
				"/images/" +
				this.props.me.profilePicture;
		} else {
			profilePicPath = process.env.PUBLIC_URL + "/images/default.jpg";
		}
		return (
			<Link to="/profile">
				<div className="profileContainer">
					<img src={profilePicPath} alt="pic" />
				</div>
			</Link>
		);
	};
	render() {
		return (
			<div className="topbarContainer">
				<div id="headerLogo">
					<Link
						to="/"
						style={{ textDecoration: "none", color: "white" }}
					>
						<h2>Clowder</h2>
					</Link>
				</div>

				{this.props.isLoggedIn ? this.renderSearchBar() : null}
				{this.renderNavigationBar()}
				{this.props.isLoggedIn ? this.renderProfile() : null}
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		me: state.user.me,
	};
};

export default connect(mapStateToProps, { logout, getMe })(Topbar);
