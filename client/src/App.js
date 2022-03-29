import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Background from "./Components/Background/Background";

import "./app.css";
//import pages
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import history from "./history";
import ErrorBlock from "./Components/ErrorBlock/ErrorBlock";
import MessageBlock from "./Components/MessageBlock/MessageBlock";

class App extends React.Component {
	render() {
		return (
			<>
				<Background />
				<ErrorBlock />
				<MessageBlock />
				<Router history={history}>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/profile/:user?" component={Profile} />
					</Switch>
				</Router>
			</>
		);
	}
}

export default App;
