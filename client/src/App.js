import React from "react";
import { Router, Switch, Route } from "react-router-dom";
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

class App extends React.Component {
	render() {
		return (
			<>
				<Background />
				<ErrorBlock />
				<MessageBlock />
				<Router history={history}>
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
						<Route exact path="/chat" component={Chat} />
						<Route path="/" component={Unhandled} />
					</Switch>
				</Router>
			</>
		);
	}
}

export default App;
