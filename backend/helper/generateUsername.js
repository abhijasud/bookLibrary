import {nanoid} from 'nanoid';
import User from "../Schema/User.js"

const generateUsername = async (email) => {
	let username = email.split("@")[0];
	let isUsernameNotUnique = await User.exists({ "username": username }).then((result) => result);
	// console.log(isUsernameNotUnique);

	isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
	return username;
}

export default generateUsername;