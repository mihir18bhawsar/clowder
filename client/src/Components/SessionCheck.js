import React from "react";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { logout } from "../actions";
import history from "../history";
class SessionCheck extends React.Component {
	out = async () => {
		await this.props.logout();
	};

	componentDidMount() {
		history.listen(() => {
			if (this.props.isLoggedIn) {
				const token = Cookies.get("token");
				if (!token) this.out();
			}
		});
	}

	render() {
		return null;
	}
}
const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
	};
};

export default connect(mapStateToProps, { logout })(SessionCheck);
