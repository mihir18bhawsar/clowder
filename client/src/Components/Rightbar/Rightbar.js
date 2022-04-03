import React from "react";
import { connect } from "react-redux";
import { CircularProgress } from "@mui/material";
import { getMeAndMore } from "../../actions";
import FriendCapsule from "../FriendCapsule/FriendCapsule";
import "./rightbar.css";

class Rightbar extends React.Component {
	state = { dataReady: false };
	_isMounted = false;
	dataLoad = async () => {
		await this.props.getMeAndMore();
	};
	componentDidMount() {
		this._isMounted = true;
		this.dataLoad().then(() => {
			if (this._isMounted) {
				this.setState({ dataReady: true });
			}
		});
	}

	render() {
		if (this.state.dataReady) {
			const followingList = this.props.users.map((user) => {
				if (this.props.me.following.includes(user._id)) {
					return (
						<FriendCapsule
							user={user}
							me={this.props.me}
							key={user._id}
						/>
					);
				} else return null;
			});
			const followersList = this.props.users.map((user) => {
				if (this.props.me.followers.includes(user._id)) {
					return (
						<FriendCapsule
							user={user}
							me={this.props.me}
							key={user._id}
						/>
					);
				} else return null;
			});

			return (
				<div className="rightContainer">
					<div className="divided">
						<div className="rightbar-heading">Following</div>
						<hr className="rightbar-hr" />
						<div className="capsule-contain">{followingList}</div>
					</div>
					<hr className="rightbar-hr-lg" />
					<div className="divided">
						<div className="rightbar-heading">Followers</div>
						<hr className="rightbar-hr" />
						<div className="capsule-contain">{followersList}</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="rightcircular">
					<CircularProgress color="inherit" />
				</div>
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		users: Object.values(state.user),
		me: state.user["me"],
	};
};

export default connect(mapStateToProps, { getMeAndMore })(Rightbar);
