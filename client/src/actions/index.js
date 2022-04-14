import authentication from "./authentication";
import messageAndError from "./messageAndError";
import user from "./user";
import post from "./post";
import conversation from "./conversation";
import chatMessage from "./chatMessage";
import path from "./path";

export const login = authentication.login;
export const logout = authentication.logout;
export const register = authentication.register;

export const messageShow = messageAndError.messageShow;
export const messageClose = messageAndError.messageClose;
export const errorShow = messageAndError.errorShow;
export const errorClose = messageAndError.errorClose;

export const getMe = user.getMe;
export const getUser = user.getUser;
export const getFollowers = user.getFollowers;
export const getFollowing = user.getFollowing;
export const getMeAndMore = user.getMeAndMore;
export const getUserCache = user.getUserCache;
export const updateMe = user.updateMe;
export const follow = user.follow;
export const unfollow = user.unfollow;
export const getSearchUsers = user.getSearchUsers;

export const createPost = post.createPost;
export const getPost = post.getPost;
export const getPosts = post.getPosts;
export const like = post.like;
export const dislike = post.dislike;

export const getMyConversations = conversation.getMyConversations;
export const createNewConversation = conversation.createNewConversation;

export const getMessagesByConversation = chatMessage.getMessagesByConversation;
export const createNewMessage = chatMessage.createNewMessage;

export const setSocket = (socket) => {
	return { type: "SET_SOCKET", payload: socket };
};
export const setOnlineUsers = (onlineUsers) => {
	return { type: "SET_ONLINE_USERS", payload: onlineUsers };
};

export const pathset = path.pathset;
