import React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import "./Post.css";

class Post extends React.Component {
	render() {
		return (
			<div className="post-container">
				<div className="top-section">
					<div className="username">Vladimir Putin</div>
					<div className="time">9 hrs ago</div>
				</div>
				<div className="post-image"></div>
				<div className="post-bottom">
					<div className="description">
						Post is posted on x of december loremIpsum jasdkfjlasd
						falksdjf aslkdfasdf aksdf jaklsjdf aklsdj fklasdj
						flkasdj flkas dfkl jasdlkfj klasdj flkajsd flkja sdflk
						ajsdlkf jdsalkf klasd fjlkasd jflkadsj flkasjd fklaj
						sdflkj asdklfj aklsdjf klaj f
					</div>
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
export default Post;
