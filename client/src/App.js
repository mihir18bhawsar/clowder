import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { connect } from "react-redux";
import { setSocket, setOnlineUsers, getMe, getPost } from "./actions";
import Background from "./Components/Background/Background";
import "./app.css";
//import pages
import Unhandled from "./pages/Unhandled/Unhandled";
import Home from "./pages/Home/Home";
import Chat from "./pages/Chat/Chat";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import history from "./history";
import ErrorBlock from "./Components/ErrorBlock/ErrorBlock";
import MessageBlock from "./Components/MessageBlock/MessageBlock";
import Topbar from "./Components/Topbar/Topbar";
import MyPosts from "./pages/MyPosts/MyPosts";
import SessionCheck from "./Components/SessionCheck.js";

class App extends React.Component {
	_mounted = false;
	//?? SOCKET ?????????????????????????????????????????????????//

	socketSet = () => {
		this.props.setSocket(this.socket);
	};

	dataload = async () => {
		await this.props.getMe();
	};

	componentDidMount() {
		this._mounted = true;
		this.socket = io("ws://localhost:8000");
		this.socket.on("connect", () => this.socketSet());
		if (this.props.isLoggedIn) {
			this.dataload().then(() => {
				if (this._mounted)
					this.socket.emit(
						"reload",
						this.props.me.username,
						this.props.me._id,
						this.props.me.profilePicture
					);
			});
		}
		this.socket.on("onlineUsersUpdated", (onlineUsers) => {
			this.props.setOnlineUsers(onlineUsers);
		});
		this.socket.on("postsUpdated", (id) => {
			if (this.props.isLoggedIn) this.props.getPost(id);
		});
	}
	componentWillUnmount() {
		this._mounted = false;
	}
	//?? SOCKET ???????????????????????????????????????????????????//
	render() {
		return (
			<>
				<Background />
				<ErrorBlock />
				<MessageBlock />
				<Router history={history}>
					<SessionCheck />
					<Topbar />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<Route
							exact
							path="/profile/:user?"
							component={Profile}
						/>
						<Route exact path="/chat/:username?" component={Chat} />
						<Route exact path="/my-posts" component={MyPosts} />
						<Route path="/" component={Unhandled} />
					</Switch>
				</Router>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		me: state.user.me,
	};
};

export default connect(mapStateToProps, {
	setSocket,
	getPost,
	setOnlineUsers,
	getMe,
})(App);
