import React from "react";
import { connect } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Modal from "../Modal/CreatePost/CreatePost";
import Post from "../Post/Post";
import { getPosts, getMeAndMore } from "../../actions";
import "./feed.css";

TimeAgo.addDefaultLocale(en);

class Feed extends React.Component {
	state = { modalActive: false };

	componentDidMount() {
		if (this.props.isLoggedIn) {
			this.props.getMeAndMore();
			this.props.getPosts();
		}
	}
	renderPostList = () => {
		const timeAgo = new TimeAgo();
		const posts = this.props.timeline.map((post) => {
			const updatedAt =
				timeAgo.format(new Date(post.updatedAt).getTime(), "mini") +
				" ago";
			const owner = this.props.users[post.postedBy].username;
			let imagesrc;
			if (post.image)
				imagesrc = `${process.env.PUBLIC_URL}/images/${post.image}`;
			const description = post.description;
			return (
				<Post
					key={post._id}
					owner={owner}
					imagesrc={imagesrc}
					description={description}
					updatedAt={updatedAt}
				/>
			);
		});
		return posts;
	};
	modalToggle = () => {
		this.setState({ modalActive: !this.state.modalActive });
	};
	render() {
		if (Object.keys(this.props.users).length)
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
						{!this.props.timeline.length ? (
							<h1 id="nopost">
								<span id="nopost-span">
									Nothing in Timeline
								</span>
								<br />
								<hr />
								Follow Users or Create a Post
							</h1>
						) : null}
						{this.renderPostList()}
					</div>
				</div>
			);
		else return "loading...";
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		timeline: state.post.timeline,
		users: state.user,
	};
};
export default connect(mapStateToProps, { getPosts, getMeAndMore })(Feed);
