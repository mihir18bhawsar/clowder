import React from "react";

import Post from "../Post/Post";
import "./feed.css";
class Feed extends React.Component {
	renderPostList = () => {
		return <Post />;
	};
	render() {
		return (
			<div className="feed-container">
				<button className="createPostBtn button">
					Create New Post
				</button>
				<div className="postListContainer">{this.renderPostList()}</div>
			</div>
		);
	}
}
export default Feed;
