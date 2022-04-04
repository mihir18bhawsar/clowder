import React from "react";
import ReactDOM from "react-dom";
import { Search } from "@material-ui/icons";
import { connect } from "react-redux";
import { getSearchUsers, getMe } from "../../actions/index";
import "./SearchFriend.css";
import FriendCapsule from "../FriendCapsule/FriendCapsule";
class SearchFriend extends React.Component {
	_isMounted = false;
	state = { dataLoaded: false, currentTerm: "", resultReady: false };

	constructor(props) {
		super(props);
		this.modalRef = React.createRef();
		this.targetRef = React.createRef();
	}

	dataload = async () => {
		await getMe();
	};
	componentDidMount() {
		this._isMounted = true;
		this.dataload().then(() => {
			if (this._isMounted) {
				this.setState({ dataLoaded: true });
			}
		});
	}
	componentWillUnmount() {
		this._isMounted = false;
	}

	fetchResult = async (term) => {
		await this.props.getSearchUsers(term);
	};

	handleInputChange(e) {
		if (this._isMounted)
			this.setState(
				{ currentTerm: e.target.value, resultReady: false },
				() => {
					if (this.state.currentTerm.length > 1) {
						this.fetchResult(this.state.currentTerm).then(() => {
							if (this._isMounted)
								this.setState({ resultReady: true });
						});
					}
				}
			);
	}

	renderResult() {
		if (this.state.resultReady) {
			const usersList = this.props.users.map((user) => {
				return (
					<FriendCapsule
						user={user}
						me={this.props.me}
						key={user._id}
					/>
				);
			});
			if (usersList.length)
				return ReactDOM.createPortal(
					<section
						className="modal-section"
						ref={this.modalref}
						onClick={(e) => {
							this.setState({
								currentTerm: "",
								resultReady: false,
							});
						}}
					>
						<div className="searchResult" ref={this.targetRef}>
							{usersList}
						</div>
					</section>,
					document.getElementById("modal")
				);
		}
	}
	render() {
		if (this.state.dataLoaded && this.props.isLoggedIn)
			return (
				<div className="searchContainer">
					<div className="search">
						<div className="searchbar">
							<Search className="searchIcon" />
							<input
								placeholder="Search for Friends"
								className="searchInput"
								onChange={(e) => this.handleInputChange(e)}
								value={this.state.currentTerm}
							/>
						</div>
					</div>
					{this.renderResult()}
				</div>
			);
		else return null;
	}
}

const mapStateToProps = (state) => {
	return {
		users: state.searchResult,
		isLoggedIn: state.auth.isLoggedIn,
		me: state.user["me"],
	};
};

export default connect(mapStateToProps, { getSearchUsers })(SearchFriend);
