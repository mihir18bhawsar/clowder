import React from "react";
import { connect } from "react-redux";

import Modal from "../Modal/CreatePost/CreatePost";
import Post from "../Post/Post";
import { getPosts, getMeAndMore } from "../../actions";
import CircularProgress from "@mui/material/CircularProgress";
import "./feed.css";

class Feed extends React.Component {
	_isMounted = false;
	state = { modalActive: false, dataReady: false };
	dataloader = async () => {
		await this.props.getMeAndMore();
		await this.props.getPosts();
	};

	componentDidMount() {
		this._isMounted = true;
		if (this.props.isLoggedIn) {
			this.dataloader().then(() => {
				if (this._isMounted) this.setState({ dataReady: true });
				console.log("data ready");
			});
		}
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	renderPostList = () => {
		let timeline;
		if (this.props.posts) {
			timeline = this.props.posts.timeline;
		}
		if (Object.values(timeline).length === 0)
			return (
				<h1 id="nopost">
					<span id="nopost-span">Nothing in Timeline</span>
					<br />
					<hr />
					Follow Users or Create a Post
				</h1>
			);

		const posts = Object.values(timeline).map((post) => {
			const ownerName = !this.props.users[post.postedBy].disabled
				? this.props.users[post.postedBy].username
				: "[deleted user]";
			const profilePic = `${process.env.PUBLIC_URL}/images/${
				this.props.users[post.postedBy].profilePicture
			}`;
			let imagesrc;
			if (post.image)
				imagesrc = `${process.env.PUBLIC_URL}/images/${post.image}`;
			const description = post.description;
			return (
				<Post
					key={post._id}
					ownerName={ownerName}
					ownerId={post.postedBy}
					imagesrc={imagesrc}
					description={description}
					profilePic={profilePic}
					post={post}
				/>
			);
		});
		return posts;
	};
	modalToggle = () => {
		this.setState({ modalActive: !this.state.modalActive });
	};
	render() {
		if (this.state.dataReady) {
			return (
				<div className="feed-container">
					<button
						className="createPostBtn button"
						onClick={this.modalToggle}
					>
						Create New Post
					</button>
					<hr />
					{this.state.modalActive ? (
						<Modal
							heading="Create Post"
							description="Enter Post Details"
							id="create-post-form"
							modalToggle={this.modalToggle}
						/>
					) : null}
					<div className="postListContainer">
						{this.renderPostList()}
					</div>
				</div>
			);
		} else
			return (
				<div className="feed-container">
					<div className="circular">
						<CircularProgress color="inherit" />
					</div>
				</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		posts: state.post,
		users: state.user,
	};
};
export default connect(mapStateToProps, { getPosts, getMeAndMore })(Feed);
