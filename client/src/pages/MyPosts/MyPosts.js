import React from "react";
import { connect } from "react-redux";
import Feed from "../../Components/Feed/Feed";
import Rightbar from "../../Components/Rightbar/Rightbar";
import OnlineFriends from "../../Components/OnlineFriends/OnlineFriends";

class MyPosts extends React.Component {
	render() {
		if (!this.props.isLoggedIn)
			return <div className="circular unhandled">Login Required!</div>;
		return (
			<div className="home-container">
				<hr />
				<main>
					<OnlineFriends />
					<Feed own />
					<Rightbar />
				</main>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
	};
};
export default connect(mapStateToProps)(MyPosts);
