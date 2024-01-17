import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bcrypt from 'bcrypt'
import generateUsername from './helper/generateUsername.js';
import checkAuth from './middleware/checkAuth.js'
import User from './Schema/User.js';
import mongoose from 'mongoose';
import formatDatatoSend from './helper/formatDataToSend.js';
import Book from "./Schema/Books.js"

const app = express();

app.use(cors());
app.use(express.json())
mongoose.connect("mongodb://localhost:27017/libraryBooks", {
	autoIndex: true,
})
	.then(() => console.log("Connected to db"))
	.catch((err) => console.log("failed to connect to db" + err))



let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post("/signup", (req, res) => {
	let { fullname, email, password, role } = req.body;

	// Data Validation from frontend

	if (fullname == undefined || fullname.length < 3) {
		return res.status(403).json({ "error": "Fullname must be atleast 3 letters long" });
	}

	if (email == undefined || !email.length) {
		return res.status(403).json({ "error": "Enter email" });
	}

	if (!emailRegex.test(email)) {
		return res.status(403).json({ "error": "Email is invalid" })
	}

	if (password == undefined || !passwordRegex.test(password)) {
		return res.status(403).json({ "error": "Password should be 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
	}



	bcrypt.hash(password, 10, async (err, hashedPassword) => {

		let username = await generateUsername(email);

		let user = new User({
			fullname,
			email,
			password: hashedPassword,
			username,
			role

		})


		user.save().then((u) => {


			return res.status(200).json(formatDatatoSend(u))
		})
			.catch(err => {
				if (err.code == 11000) {
					return res.status(500).json({ "error": "email already exists" });
				}
				console.log(err);
				return res.status(500).json({ "error": err.message });
			})

	})


})

app.post("/signin", (req, res) => {
	let { email, password } = req.body;
	console.log(email, password);
	User.findOne({ "email": email })
		.then((user) => {

			if (!user) {
				return res.status(403).json({ "error": "email not found" });
			}

			bcrypt.compare(password, user.password, (err, result) => {
				if (err) {
					return res.status(403).json({ "Error": "Error occured while login please try again" });
				}
				if (!result) {
					return res.status(403).json({ "error": "Incorrect password" })
				} else {
					return res.status(200).json(formatDatatoSend(user));
				}
			})
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ "status": err.message });
		})


})

app.post('/create', checkAuth, async (req, res) => {
	try {
		const { title, authors, isbn, tags, language, totalPages, image } = req.body;
		const createdBy = req.user.id;

		if(req.user.role != "creator"){
			return res.status(401).json({error: "Unauthorized"})
		}

		// Create the book
		const book = await Book.create({
			title,
			authors,
			isbn,
			tags,
			language,
			totalPages,
			createdBy,
			image,
		});

		// Update the user's books array
		await User.findByIdAndUpdate(createdBy, { $push: { books: book._id } });

		res.status(201).json({ message: 'Book created successfully', book });
	} catch (error) {
		if(error.code == 11000){
			return res.status(401).json({ error: 'Book with same ISBN already in the database' });

		}
		res.status(500).json({ error: 'Internal Server Error' });
	}
});


app.get('/getBooks', checkAuth, async (req, res) => {
	try {
	  const userRole = req.user.role;
	  
  
	  let books;
	  if (userRole === 'creator') {
		books = await Book.find({ createdBy: req.user.id });
	  } else if (userRole === 'viewer') {
		books = await Book.find();
	  } else {
		return res.status(403).json({ error: 'Invalid user role' });
	  }
  
	  res.status(200).json({ books });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });


app.listen(process.env.PORT, () =>
	console.log(`app listening on port ${process.env.PORT}!`),
);

