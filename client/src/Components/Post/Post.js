import React from "react";
import { connect } from "react-redux";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import "./Post.css";
import { getPosts } from "../../actions";

class Post extends React.Component {
	componentDidMount() {
		if (this.props.isLoggedIn) this.props.getPosts();
	}
	renderDescription() {
		return <div className="description">{this.props.description}</div>;
	}
	renderImage() {
		return (
			<div className="post-image">
				<img src={this.props.imagesrc} alt="postimage" />
			</div>
		);
	}
	render() {
		return (
			<div className="post-container">
				<div className="top-section">
					<div className="username">{this.props.owner}</div>
					<div className="time">{this.props.updatedAt}</div>
				</div>
				{this.props.imagesrc ? this.renderImage() : null}
				<div className="post-bottom">
					{this.props.description ? this.renderDescription() : null}
					<div className="post-buttons">
						<ThumbUpIcon />
						<ThumbDownIcon />
						<PersonAddIcon />
					</div>
				</div>
			</div>
		);
	}
}
export default connect(null, { getPosts })(Post);
