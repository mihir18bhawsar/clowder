import authentication from "./authentication";
import messageAndError from "./messageAndError";
import user from "./user";

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
