import mongoose, { Schema } from "mongoose";


const booksSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	authors: [{ type: String, required: true }],
	isbn: {
		type: String,
		unique: true,
		required: true
	},
	tags: {
		type: [{ type: String }]
	},
	language: {
		type: String,
	},
	totalPages: {
		type: String
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users'
	},
	createdAt: {
		type: Date,
    	default: Date.now,
	},
	image: {
		type: String
	}

})

export default mongoose.model("books", booksSchema);