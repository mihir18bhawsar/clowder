import React from "react";
import FriendCapsule from "../FriendCapsule/FriendCapsule";
import { connect } from "react-redux";
import { getMe } from "../../actions";
import "./onlineFriends.css";
import { CircularProgress } from "@mui/material";

class OnlineFriends extends React.Component {
	state = { dataReady: false };
	_mounted = false;

	dataload = async () => {
		await this.props.getMe();
	};

	componentDidMount() {
		this._mounted = true;
		this.setState({ dataReady: false });
		this.dataload().then(() => {
			if (this._mounted) this.setState({ dataReady: true });
		});
	}
	componentWillUnmount() {
		this._mounted = false;
	}
	renderList = () => {
		const list = Object.values(this.props.onlineUsers).map((user) => {
			return (
				<FriendCapsule
					chat
					user={user}
					me={this.props.me}
					key={user.username}
				/>
			);
		});
		return list;
	};
	render() {
		if (this.state.dataReady)
			return (
				<div className="of-container">
					<div className="rightbar-heading">Online</div>
					<hr className="rightbar-hr" />
					<ul>{this.renderList()}</ul>
				</div>
			);
		else
			return (
				<div className="circular">
					<CircularProgress />
				</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		onlineUsers: state.onlineUsers,
		me: state.user.me,
	};
};

export default connect(mapStateToProps, { getMe })(OnlineFriends);
