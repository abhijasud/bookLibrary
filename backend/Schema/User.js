import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		minlength: [3, 'Fullname must be atleast 3 letters long']
	},
	username: {
		type: String,
		minlength: [3, 'Username must be 3 letters long'],
		unique: true,
	},
	password: String,
	role: {
		type: String,
		enum: ["creator", "viewer"]
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	},
	books: {
		type: [ Schema.Types.ObjectId ],
        ref: 'books',
        default: [],
	}

})

export default mongoose.model("users", userSchema);