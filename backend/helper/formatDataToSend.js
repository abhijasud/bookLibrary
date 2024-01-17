import { signJWT } from "../auth/jwt_helper.js"

const formatDatatoSend = (user) => {
	// console.log(user);
	const payload = {
		id: user._id,
		role: user.role
	}
	const access_token = signJWT(payload);

	return {
		access_token,
		username: user.username,
		fullname: user.fullname,
		role: user.role
	}
}

export default formatDatatoSend