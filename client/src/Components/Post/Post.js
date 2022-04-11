import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import "./Post.css";
import { getMe, unfollow, like, dislike } from "../../actions";
import { CircularProgress } from "@mui/material";

TimeAgo.addLocale(en);

class Post extends React.Component {
	state = { view: false };

	renderDescription() {
		return <div className="description">{this.props.description}</div>;
	}

	renderPortal = () => {
		return ReactDOM.createPortal(
			<div className="modal" onClick={() => this.toggleView()}>
				<div
					className="imageView"
					style={{
						background: `url(${this.props.imagesrc})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				></div>
			</div>,
			document.getElementById("modal")
		);
	};

	toggleView = () => {
		this.setState({ view: !this.state.view });
	};

	renderImage() {
		return (
			<>
				<div className="post-image">
					<img
						src={this.props.imagesrc}
						alt="postimage"
						onClick={() => this.toggleView()}
					/>
				</div>
				{this.state.view ? this.renderPortal() : null}
			</>
		);
	}

	handleLike = () => {
		this.props.like(this.props.post._id);
	};
	handleDislike = () => {
		this.props.dislike(this.props.post._id);
	};

	renderPostBottom = () => {
		const liked = this.props.post.likes.includes(this.props.me._id)
			? "liked"
			: "";
		const disliked = this.props.post.dislikes.includes(this.props.me._id)
			? "disliked"
			: "";

		const buttonClassname =
			this.props.post.postedBy === this.props.me._id
				? `mini-post-buttons disabled`
				: `mini-post-buttons`;
		return (
			<div className="post-bottom">
				{this.props.description ? this.renderDescription() : null}
				<div className="post-buttons">
					<div className="mini-post-buttons-container">
						<ThumbUpIcon
							className={buttonClassname + " " + liked}
							onClick={this.handleLike}
						/>
						{this.props.post.likes.length}
					</div>
					<div className="mini-post-buttons-container">
						<ThumbDownIcon
							className={buttonClassname + " " + disliked}
							onClick={this.handleDislike}
						/>
						{this.props.post.dislikes.length}
					</div>
					{this.props.me.following.includes(this.props.ownerId) ? (
						<div className="mini-post-buttons-container">
							<PersonRemoveIcon
								className={buttonClassname}
								onClick={() => {
									this.props.unfollow(this.props.ownerId);
								}}
							/>
						</div>
					) : null}
				</div>
			</div>
		);
	};
	render() {
		if (this.props.me) {
			if (
				this.props.me._id === this.props.ownerId ||
				this.props.me.following.includes(this.props.ownerId)
			) {
				const timeAgo = new TimeAgo();
				const createdAt =
					timeAgo.format(
						new Date(this.props.post.createdAt).getTime(),
						"mini"
					) + " ago";
				return (
					<div className="post-container">
						<div className="top-section">
							<Link
								to={`/profile/${this.props.ownerName}`}
								className="postProfileLink"
							>
								<img
									className="propic"
									src={this.props.profilePic}
									alt="pic"
								/>
								<div className="username">
									{this.props.ownerName}
								</div>
							</Link>
							<div className="time">{createdAt}</div>
						</div>
						{this.props.imagesrc ? this.renderImage() : null}
						{this.renderPostBottom()}
					</div>
				);
			} else return null;
		} else
			return (
				<div className="circular">
					<CircularProgress color="inherit" />
				</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		me: state.user["me"],
	};
};

export default connect(mapStateToProps, { getMe, unfollow, like, dislike })(
	Post
);
