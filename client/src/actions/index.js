import authentication from "./authentication";
import messageAndError from "./messageAndError";
import user from "./user";
import post from "./post";

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

export const createPost = post.createPost;
export const getPosts = post.getPosts;
export const like = post.like;
export const dislike = post.dislike;
