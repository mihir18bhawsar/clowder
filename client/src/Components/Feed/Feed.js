import React from "react";
import { connect } from "react-redux";
import Modal from "../Modal/CreatePost/CreatePost";
import Post from "../Post/Post";
import { getPosts } from "../../actions";
import "./feed.css";
class Feed extends React.Component {
	state = { modalActive: false };

	componentDidMount() {
		if (this.props.isLoggedIn) this.props.getPosts();
	}
	renderPostList = () => {
		return <Post />;
	};
	modalToggle = () => {
		this.setState({ modalActive: !this.state.modalActive });
	};
	render() {
		return (
			<div className="feed-container">
				<button
					className="createPostBtn button"
					onClick={this.modalToggle}
				>
					Create New Post
				</button>
				{this.state.modalActive ? (
					<Modal
						heading="Create Post"
						description="Enter Post Details"
						id="create-post-form"
						modalToggle={this.modalToggle}
					/>
				) : null}
				<div className="postListContainer">{this.renderPostList()}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		timeline: state.post.timeline,
	};
};
export default connect(mapStateToProps, { getPosts })(Feed);
