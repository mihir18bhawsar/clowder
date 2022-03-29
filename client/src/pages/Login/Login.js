import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { login, messageShow } from "../../actions";
import Background from "../../Components/Background/Background";
import Topbar from "../../Components/Topbar/Topbar";
import history from "../../history";

import "./Login.css";

class Login extends React.Component {
	constructor(props) {
		super(props);
		if (props.isLoggedIn && history.location.pathname === "/login") {
			props.messageShow("Already Logged In");
			history.push("/");
		}
	}
	onSubmit = (formValues) => {
		this.props.login(formValues);
	};
	renderInput = ({ input, meta, Type, Label, ClassName }) => {
		return (
			<div className="fieldContainer">
				<label>{Label}</label>
				<input {...input} type={Type} className={ClassName} />
			</div>
		);
	};
	render() {
		return (
			<>
				<Background />
				<div className="login-container">
					<Topbar />
					<div className="authContainer">
						<div className="login-heading">Login</div>
						<div className="login-subheading">
							provide your email and password
						</div>
						<form
							id="login-form"
							onSubmit={this.props.handleSubmit(this.onSubmit)}
						>
							<Field
								name="email"
								component={this.renderInput}
								Type="text"
								Label="Email"
								ClassName="textfield"
							/>
							<Field
								name="password"
								component={this.renderInput}
								Type="password"
								Label="Password"
								ClassName="textfield"
							/>

							<button type="submit" className="submit-button">
								Submit
							</button>
						</form>
					</div>
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
	};
};

export default connect(mapStateToProps, { login, messageShow })(
	reduxForm({ form: "login" })(Login)
);
