import React from "react";
import ReactDOM from "react-dom";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

import { createPost, errorShow } from "../../../actions/index";
import "./CreatePost.css";
import history from "../../../history";

class CreatePost extends React.Component {
	modalClickHandle = () => {
		this.props.modalToggle();
		history.push("/");
	};
	innerClickHandle = (e) => {
		if (document.querySelector(".authContainer").contains(e.target)) {
			e.stopPropagation();
		}
	};
	componentDidMount() {
		document
			.querySelector(".modal")
			.addEventListener("click", (e) => this.modalClickHandle());
		document
			.querySelector(".authContainer")
			.addEventListener("click", (e) => this.innerClickHandle(e));
	}
	componentWillUnmount() {
		document
			.querySelector(".modal")
			.removeEventListener("click", (e) => this.modalClickHandle());
		document
			.querySelector(".authContainer")
			.removeEventListener("click", (e) => this.innerClickHandle(e));
	}

	onSubmit = (formValues) => {
		let formData = new FormData();
		if (formValues.description)
			formData.append("description", formValues.description);
		if (formValues.image) formData.append("image", formValues.image);
		this.props.createPost(formData);
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
			</div>
		);
	};
	renderInput = ({ input, meta, Type, Label, ClassName }) => {
		if (Type === "file") {
			return this.renderFile({ input, meta, Type, Label, ClassName });
		}
		if (Type === "textarea")
			return this.renderTextArea({ input, meta, Type, Label, ClassName });

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
		return ReactDOM.createPortal(
			<div className="modal">
				<div className="authContainer">
					<div className="login-heading">
						{this.props.heading || "form"}
					</div>
					<div className="login-subheading">
						{this.props.description || "enter form data"}
					</div>
					<form
						id="create-post-form"
						onSubmit={this.props.handleSubmit(this.onSubmit)}
					>
						<Field
							name="image"
							component={this.renderInput}
							Type="file"
							Label="Image"
							ClassName="fileChoose"
						/>
						<Field
							name="description"
							component={this.renderInput}
							Type="textarea"
							Label="Description"
							ClassName="textfield lengthyField"
						/>

						<button type="submit" className="submit-button">
							Submit
						</button>
					</form>
				</div>
			</div>,
			document.getElementById("modal")
		);
	}
}

const rf = reduxForm({ form: "create-post" })(CreatePost);
export default connect(null, { createPost, errorShow })(rf);
