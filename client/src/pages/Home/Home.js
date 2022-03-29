import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFollowing, getFollowers } from "../../actions";
import "./Home.css";
import Topbar from "../../Components/Topbar/Topbar";
import Feed from "../../Components/Feed/Feed";
import Rightbar from "../../Components/Rightbar/Rightbar";
import OnlineFriends from "../../Components/OnlineFriends/OnlineFriends";

class Home extends React.Component {
	componentDidMount() {
		if (this.props.isLoggedIn) {
			this.props.getFollowing();
			this.props.getFollowers();
		}
	}
	authenticatedRender() {
		return (
			<>
				<OnlineFriends />
				<Feed />
				<Rightbar />
			</>
		);
	}
	unauthenticatedRender() {
		return (
			<div id="first-page-container">
				<div className="half">
					<div className="heading">
						Clowder<span> a social media application</span>
					</div>
				</div>
				<div className="half">
					<div className="short heading">Join The Cats Now!</div>
					<div className="buttons-container">
						<Link to="/login" className="button-link">
							<Button variant="contained" className="uibuttons">
								Login
							</Button>
						</Link>
						<Link to="/register" className="button-link">
							<Button variant="contained" className="uibuttons">
								Sign Up
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
	render() {
		return (
			<div className="home-container">
				<Topbar />
				<hr />
				<main>
					{this.props.isLoggedIn
						? this.authenticatedRender()
						: this.unauthenticatedRender()}
				</main>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
	};
};
export default connect(mapStateToProps, { getFollowing, getFollowers })(Home);
