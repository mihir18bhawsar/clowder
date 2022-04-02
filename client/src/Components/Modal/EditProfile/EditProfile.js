import React from "react";
import ReactDOM from "react-dom";
import history from "../../../history";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { updateMe, messageShow } from "../../../actions";

import "./EditProfile.css";

class EditProfile extends React.Component {
	constructor(props) {
		super(props);
		this.modalref = React.createRef();
		this.innerref = React.createRef();
	}

	modalClickHandle = () => {
		this.props.modalToggle();
		history.push("/profile");
	};
	innerClickHandle = (e) => {
		if (this.innerref.current.contains(e.target)) {
			e.stopPropagation();
		}
	};
	componentDidMount() {
		this.modalref.current.addEventListener("click", (e) =>
			this.modalClickHandle()
		);
		this.innerref.current.addEventListener("click", (e) =>
			this.innerClickHandle(e)
		);
	}
	componentWillUnmount() {
		this.modalref.current.removeEventListener("click", (e) =>
			this.modalClickHandle()
		);
		this.innerref.current.removeEventListener("click", (e) =>
			this.innerClickHandle(e)
		);
	}
	onSubmit = (formValues) => {
		const formData = new FormData();
		if (formValues.dob) formData.append("dob", formValues.dob);
		if (formValues.about) formData.append("about", formValues.about);
		if (formValues.country) formData.append("country", formValues.country);
		if (formValues.relationship)
			formData.append("relationship", formValues.relationship);
		if (formValues.username)
			formData.append("username", formValues.username);
		if (formValues.profilePicture)
			formData.append("profilePicture", formValues.profilePicture);
		if (formValues.coverPicture)
			formData.append("coverPicture", formValues.coverPicture);
		this.props.updateMe(formData);
		this.props.modalToggle();
	};
	handleFileChange = (event, input) => {
		event.preventDefault();
		let imageFile = event.target.files[0];
		if (imageFile) {
			input.onChange(imageFile);
		} //we had to change file here because redux cant use {...input} to handle form state.
	};
	renderFile = ({ input, meta, Type, Label, ClassName }) => {
		return (
			<div className="fieldContainer gapped">
				<label>{Label}</label>
				<input
					onChange={(event) => this.handleFileChange(event, input)}
					type={Type}
					className={ClassName}
				/>
			</div>
		);
	};

	renderTextArea = ({ input, meta, Type, Label, ClassName }) => {
		return (
			<div className="fieldContainer">
				<label>{Label}</label>
				<div className="textarea-container">
					<textarea
						className={ClassName}
						type={Type}
						{...input}
						spellCheck="false"
					></textarea>
				</div>
				{this.renderError(meta)}
			</div>
		);
	};
	renderError = (meta) => {
		return (
			<div className="metaerror">
				{meta.error && meta.touched && !meta.active
					? "*" + meta.error
					: null}
			</div>
		);
	};

	renderInput = ({ input, meta, Type, Label, ClassName }) => {
		if (Type === "file") {
			return this.renderFile({ input, meta, Type, Label, ClassName });
		}
		if (Type === "textarea")
			return this.renderTextArea({ input, meta, Type, Label, ClassName });
		if (Type === "date") {
			return (
				<div className="fieldContainer">
					<label>{Label}</label>
					<input
						{...input}
						type={Type}
						className={ClassName}
						max="2012-12-31"
					/>
					{this.renderError(meta)}
				</div>
			);
		}
		return (
			<div className="fieldContainer">
				<label>{Label}</label>
				<input {...input} type={Type} className={ClassName} />
				{this.renderError(meta)}
			</div>
		);
	};

	render() {
		return ReactDOM.createPortal(
			<div className="modal" ref={this.modalref}>
				<div className="authContainer" ref={this.innerref}>
					<div className="login-heading">Edit profile</div>
					<div className="login-subheading">
						Enter Your Details to edit
					</div>
					<div className="div">
						<form
							id="epform"
							onSubmit={this.props.handleSubmit(this.onSubmit)}
						>
							<Field
								name="username"
								component={this.renderInput}
								Type="text"
								Label="UserName"
								ClassName="textfield"
							/>
							<Field
								name="about"
								component={this.renderInput}
								Type="textarea"
								Label="About"
								ClassName="textfield"
							/>
							<Field
								name="profilePicture"
								component={this.renderInput}
								Type="file"
								Label="Profile picture"
								ClassName="fileChoose"
							/>
							<Field
								name="coverPicture"
								component={this.renderInput}
								Type="file"
								Label="Cover picture"
								ClassName="fileChoose"
							/>
							<Field
								name="country"
								component={this.renderInput}
								Type="text"
								Label="Country"
								ClassName="textfield"
							/>
							<Field
								name="relationship"
								component={this.renderInput}
								Type="text"
								Label="Relationship"
								ClassName="textfield"
							/>
							<Field
								name="dob"
								component={this.renderInput}
								Type="date"
								Label="Date of Birth"
								className="datefield"
							/>
							<button type="submit" className="submit-button">
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>,
			document.getElementById("modal")
		);
	}
}
const validate = (formValues) => {
	const error = {};
	if (!formValues.username) {
		error.username = "Username is required";
	}
	return error;
};

const rf = reduxForm({ form: "editProfile", validate })(EditProfile);

export default connect(null, { updateMe, messageShow })(rf);
