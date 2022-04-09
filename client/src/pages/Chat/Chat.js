import React from "react";
import ReactDOM from "react-dom";
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
	createNewMessage,
	getUserCache,
	createNewConversation,
} from "../../actions";
import ForumIcon from "@mui/icons-material/Forum";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import OnlineFriends from "../../Components/OnlineFriends/OnlineFriends";
import ChatMessage from "../../Components/ChatMessage/ChatMessage";

import "./chat.css";

import { CircularProgress } from "@mui/material";

TimeAgo.addLocale(en);
class Chat extends React.Component {
	_mounted = false;
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			dataLoaded: false,
			messageReady: false,
			timer: 0,
			viewModal: false,
		};
		this.formref = React.createRef();
		this.dummyref = React.createRef();
		this.modalFormRef = React.createRef();
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
			if (findconv) await this.messageLoad(findconv._id);
		}
	};

	componentDidMount() {
		setInterval(() => {
			if (this._mounted) this.setState({ timer: this.state.timer + 1 });
		}, 1000); //
		if (!this.props.isLoggedIn) {
			history.push("/login");
		}
		this._mounted = true;
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
	//if user switches chats load new chat data
	componentDidUpdate(prevProps) {
		if (
			history.location.pathname !== "/chat" &&
			prevProps.match.params.username !== this.props.match.params.username
		) {
			// history.go(`/chat/${this.props.match.params.username}`);
			if (this._mounted) {
				this.setState(
					{
						messageReady: false,
					},
					() => {
						this.updateConversationId().then(() => {
							if (this._mounted)
								this.setState({ messageReady: true });
							this.dummyref.current.scrollIntoView({
								behavior: "smooth",
							}); //new conversation load
						});
					}
				);
			}
		}
		if (this.props.chatMessage.length > prevProps.chatMessage.length)
			//new message
			this.dummyref.current?.scrollIntoView({ behavior: "smooth" });
	}

	componentWillUnmount() {
		this._mounted = false;
	}
	//thin bar display photos of friends and create links for our chat with them

	toggleModal = (e) => {
		if (this._mounted) this.setState({ viewModal: !this.state.viewModal });
	};

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
				<AddCircleIcon
					className="chat-icon-bottom"
					onClick={(e) => this.toggleModal(e)}
				/>
				{this.state.viewModal ? this.renderModal() : null}
			</>
		);
	};

	submitProcess = async () => {
		const formdata = new FormData(this.modalFormRef.current);
		await this.props.getUserCache([...formdata.values()][0]);
		await this.props.createNewConversation(this.props.cache);
	};

	modalSubmitHandle = (e) => {
		e.preventDefault();
		this.submitProcess();
		this.toggleModal(e);
	};

	renderModal = () => {
		return ReactDOM.createPortal(
			<div className="modal" onClick={(e) => this.toggleModal(e)}>
				<form
					className="conversation-create-form"
					onSubmit={(e) => {
						this.modalSubmitHandle(e);
					}}
					ref={this.modalFormRef}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<div className="Modal-heading">Create Conversation</div>

					<input
						name="username"
						type="text"
						value={this.state.conversationFormValue}
						className="textfield"
						placeholder="Enter Username"
					/>
					<button type="submit" className="submit-button">
						Create
					</button>
				</form>
			</div>,
			document.getElementById("modal")
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

	renderMsgFrm = () => {
		return (
			<div className="message-form-container">
				<form
					autoComplete="off"
					className="message-form"
					ref={this.formref}
				>
					<input
						className="chat-input"
						spellCheck="false"
						name="message"
						type="text"
						onChange={(e) => {
							let text;
							if (e.target.value)
								text =
									e.target.value[0].toUpperCase() +
									e.target.value.slice(1);
							this.setState({ text: text || e.target.value });
						}}
						value={this.state.text}
					/>
					<button
						type="submit"
						className="chat-message-submit-button"
						onClick={(e) => {
							this.formSubmitHandler(e);
						}}
					>
						<FlightTakeoffIcon />
					</button>
				</form>
			</div>
		);
	};

	renderChatArea = () => {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const currentTime = `${
			days[new Date(Date.now()).getUTCDay()]
		} ${new Date(Date.now()).toLocaleString()}`;
		return (
			<>
				<div className="time-display">{currentTime}</div>
				<div className="chat-display">
					{this.state.messageReady ? (
						this.renderMessagesList()
					) : (
						<div className="circular">
							<CircularProgress />
						</div>
					)}
					<div className="dummy" ref={this.dummyref}></div>
				</div>
				{this.props.match.params.username ? this.renderMsgFrm() : null}
			</>
		);
	};
	formSubmitHandler(e) {
		e.preventDefault();
		const formdata = new FormData(this.formref.current);
		const text = formdata.get("message");
		if (!text.length) return;
		const later = Object.values(this.props.users).find((u) => {
			if (u.username === this.props.match.params.username) {
				return true;
			}
			return false;
		});
		const findconv = Object.values(this.props.conversation).find((conv) =>
			conv.members.includes(later._id)
		);
		this.props.createNewMessage(text, findconv._id);
		this.setState({ text: "" });
	}
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
		cache: state.cacheUser?._id,
	};
};

export default connect(mapStateToProps, {
	getMyConversations,
	getUser,
	getMe,
	getMessagesByConversation,
	createNewMessage,
	getUserCache,
	createNewConversation,
})(Chat);
