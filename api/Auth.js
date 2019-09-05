import Cookie from "js-cookie";

export const setToken = (token) => {
	return process.browser ? Cookie.set("token", token) : undefined;
}

export const unsetToken = () => {
	if (!process.browser) {
		return;
	}
	Cookie.remove("token");

	// to support logging out from all windows
	window.localStorage.setItem("logout", Date.now());
}

export const getTokenFromServerCookie = (req) => {
	if (!req.headers.cookie) {
		return undefined;
	}
	const cookie = req.headers.cookie.split(";").find(c => c.trim().startsWith("token="));
	if (!cookie) {
		return undefined;
	}
	return cookie.split("=")[1];
}

export const getTokenFromLocalCookie = () => {
	return Cookie.getJSON("token");
}