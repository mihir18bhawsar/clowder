import React from "react";
import _ from "lodash";
import history from "../../history";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import {
	getMyConversations,
	getUser,
	getMe,
	getMessagesByConversation,
} from "../../actions";
import ForumIcon from "@mui/icons-material/Forum";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import OnlineFriends from "../../Components/OnlineFriends/OnlineFriends";
import ChatMessage from "../../Components/ChatMessage/ChatMessage";

import "./chat.css";

import { CircularProgress } from "@mui/material";

TimeAgo.addDefaultLocale(en);
class Chat extends React.Component {
	_mounted = false;
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			dataLoaded: false,
			messageReady: false,
		};
	}
	//get all members conversed with and conversations
	dataload = async () => {
		await this.props.getMe();
		await this.props.getMyConversations();
		const conversationsList = Object.values(this.props.conversation);
		const memberList = [];
		if (conversationsList.length) {
			conversationsList.forEach((conversation) => {
				memberList.push(...conversation.members);
			});
		}
		const memberpromises = _.uniq(memberList).map(async (id) => {
			await this.props.getUser(id);
		});
		await Promise.all(memberpromises);
	};

	messageLoad = async (convid) => {
		await this.props.getMessagesByConversation(convid);
	};
	//find user with pathname and check in which of our conversation he comes | get that conversation.
	updateConversationId = async () => {
		if (this.props.match.params.username) {
			const later = Object.values(this.props.users).find((u) => {
				if (u.username === this.props.match.params.username) {
					return true;
				}
				return false;
			});
			const findconv = Object.values(this.props.conversation).find(
				(conv) => conv.members.includes(later._id)
			);
			await this.messageLoad(findconv._id);
		}
	};

	componentDidMount() {
		if (!this.props.isLoggedIn) {
			history.push("/login");
		}
		this._mounted = true;
		this.dataload().then(() => {
			if (this._mounted)
				this.setState({ dataLoaded: true }, () => {
					this.updateConversationId().then(() => {
						if (this._mounte) this.setState({ messageReady: true });
					});
				});
		});
	}
	//if user switches chats load new chat data
	componentDidUpdate(prevProps) {
		if (
			history.location.pathname !== "/chat" &&
			prevProps.match.params.username !== this.props.match.params.username
		) {
			// history.go(`/chat/${this.props.match.params.username}`);
			if (this._mounted) {
				this.setState({
					dataLoaded: false,
					messageReady: false,
				});
			}
			this.dataload().then(() => {
				if (this._mounted)
					this.setState({ dataLoaded: true }, () => {
						this.updateConversationId().then(() => {
							if (this._mounted)
								this.setState({ messageReady: true });
						});
					});
			});
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}
	//thin bar display photos of friends and create links for our chat with them
	renderMyConversations = () => {
		const list = Object.values(this.props.conversation).map((conv) => {
			const notMe = conv.members.filter(
				(member) => member !== this.props.me._id
			)[0];
			return (
				<li className="conversation-link-container" key={conv._id}>
					<Link
						to={`/chat/${this.props.users[notMe].username}`}
						className="conversation-link"
					>
						<img
							src={
								process.env.PUBLIC_URL +
								`/images/${
									this.props.users[notMe].profilePicture ||
									"default.jpg"
								}`
							}
							alt="profile"
							className="conversation-icon"
						/>
					</Link>
				</li>
			);
		});

		return (
			<>
				<ForumIcon className="chat-icon" />
				<hr className="chat-hr" />
				<ul>{list}</ul>
			</>
		);
	};

	renderMessages = () => {
		const list = this.props.chatMessage.map((message) => {
			const time = new TimeAgo("en-US").format(
				new Date(message.createdAt).getTime(),
				"mini"
			);
			if (message.sender === this.props.me._id)
				return (
					<ChatMessage
						key={message._id}
						username="You"
						time={time}
						text={message.text}
						own
					/>
				);
			else
				return (
					<ChatMessage
						key={message._id}
						username={this.props.users[message.sender].username}
						time={time}
						text={message.text}
					/>
				);
		});
		return <>{list}</>;
	};

	renderMessagesList = () => {
		if (
			this.props.match.params.username &&
			Object.values(this.props.conversation).length
		) {
			return this.renderMessages();
		} else {
			return (
				<h1 className="chat-default-message">
					Click on a Conversation or Create new to start a chat
				</h1>
			);
		}
	};

	renderChatArea = () => {
		return (
			<>
				<div className="chat-display">
					{this.props.chatMessage ? (
						this.renderMessagesList()
					) : (
						<div className="circular">
							<CircularProgress />
						</div>
					)}
				</div>
				<div className="message-form-container">
					<form className="message-form">
						<input
							className="chat-input"
							spellCheck="false"
							type="text"
							onChange={(e) =>
								this.setState({ text: e.target.value })
							}
							value={this.state.text}
						/>
						<button
							type="submit"
							className="chat-message-submit-button"
						>
							<FlightTakeoffIcon />
						</button>
					</form>
				</div>
			</>
		);
	};
	render() {
		if (this.state.dataLoaded) {
			return (
				<>
					<hr />
					<div className="chat-container">
						<div className="conversation-links">
							{this.renderMyConversations()}
						</div>
						<div className="chat-main">{this.renderChatArea()}</div>
						<OnlineFriends />
					</div>
				</>
			);
		} else
			return (
				<div className="chat-container">
					<div className="circular">
						<CircularProgress />
					</div>
				</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		conversation: state.conversation,
		me: state.user["me"],
		users: state.user,
		chatMessage: state.chatMessage,
	};
};

export default connect(mapStateToProps, {
	getMyConversations,
	getUser,
	getMe,
	getMessagesByConversation,
})(Chat);
