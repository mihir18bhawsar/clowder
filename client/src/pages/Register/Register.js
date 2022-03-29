import React from "react";
import Background from "../../Components/Background/Background";
import Topbar from "../../Components/Topbar/Topbar";

import "./Register.css";

export default function Login() {
	return (
		<>
			<Background />
			<div className="login-container">
				<Topbar />
				<div className="authContainer">
					<div className="login-heading">Register</div>
					<div className="login-subheading">
						provide your username,email and password
					</div>
					<form>
						<div className="fieldContainer">
							<label htmlFor="username">Username</label>
							<input
								name="username"
								type="text"
								className="textfield"
								autoComplete="off"
							/>
						</div>
						<div className="fieldContainer">
							<label htmlFor="email">Email</label>
							<input
								name="email"
								type="text"
								className="textfield"
								autoComplete="off"
							/>
						</div>
						<div className="fieldContainer">
							<label htmlFor="password">Password</label>
							<input
								name="password"
								type="password"
								className="textfield"
								autoComplete="off"
							/>
						</div>
						<button type="submit" className="submit-button">
							Create Account
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
