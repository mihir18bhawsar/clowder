import React from "react";
import { connect } from "react-redux";
import { messageShow, register } from "../../actions";
import Background from "../../Components/Background/Background";
import history from "../../history";
import { Field, reduxForm } from "redux-form";

import "./Register.css";

class Register extends React.Component {
	constructor(props) {
		super(props);
		if (props.isLoggedIn) {
			props.messageShow("Already Logged in!");
			history.push("/");
		}
	}
	onSubmit = (formValues) => {
		this.props.register(formValues);
	};
	renderInput = ({ input, meta, Type, Label, ClassName }) => {
		return (
			<div className="fieldContainer">
				<label>{Label}</label>
				<input {...input} type={Type} className={ClassName} />
				<div className="metaerror">
					{meta.error && meta.touched && !meta.active
						? "*" + meta.error
						: null}
				</div>
			</div>
		);
	};
	render() {
		return (
			<>
				<Background />
				<div className="login-container">
					<div className="regis authContainer">
						<div className="login-heading">Register</div>
						<div className="login-subheading">
							provide your username,email and password
						</div>
						<form
							id="register-form"
							onSubmit={this.props.handleSubmit(this.onSubmit)}
						>
							<Field
								name="username"
								component={this.renderInput}
								Type="text"
								Label="Username"
								ClassName="textfield"
							/>
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
							<Field
								name="confirm"
								component={this.renderInput}
								Type="password"
								Label="Confirm"
								ClassName="textfield"
							/>

							<button type="submit" className="submit-button">
								Create Account
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

const validate = (formValues) => {
	const errors = {};
	if (!formValues.username) {
		errors.username = "username required";
	}
	if (!formValues.email) {
		errors.email = "email required";
	}
	if (!formValues.password) {
		errors.password = "enter password";
	}
	if (!formValues.confirm) {
		errors.confirm = "confirm password";
	}
	if (formValues.confirm !== formValues.password) {
		errors.confirm = "passwords do not match";
	}
	return errors;
};

const reduxFormConf = reduxForm({
	form: "register",
	validate,
})(Register);
export default connect(mapStateToProps, { messageShow, register })(
	reduxFormConf
);
