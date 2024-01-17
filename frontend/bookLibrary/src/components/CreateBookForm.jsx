import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import { UserContext } from '../App';
import { Link, Navigate } from 'react-router-dom';

const CreateBookForm = () => {

	let { userAuth: { access_token, role } } = useContext(UserContext);

	const [bookData, setBookData] = useState({
		title: '',
		authors: '',
		isbn: '',
		tags: '',
		language: '',
		totalPages: '',
		image: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBookData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	
	

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {

			const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/create`, bookData, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});

			toast.success("Book Created Successfully")
			console.log(response.data);


			setBookData({
				title: '',
				authors: '',
				isbn: '',
				tags: '',
				language: '',
				totalPages: '',
				image: '',
			});
		} catch (error) {

			console.error('Error creating book:', error);
		}
	};

	return (
		role == "viewer" ? (<Navigate to="/" />)

		: (<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
			<Link to="/" className='btn-dark mb-9'>Go back</Link>
			<Toaster />
			<h2 className="text-2xl font-semibold mb-4 mt-3">Create Book</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium text-gray-600">
						Title:
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={bookData.title}
						onChange={handleChange}
						className="mt-1 p-2 w-full border rounded-md"
						required
					/>
				</div>

				<div>
					<label htmlFor="authors" className="block text-sm font-medium text-gray-600">
						Authors:
					</label>
					<input
						type="text"
						id="authors"
						name="authors"
						value={bookData.authors}
						onChange={handleChange}
						className="mt-1 p-2 w-full border rounded-md"
						required
					/>
				</div>

				<div>
					<label htmlFor="isbn" className="block text-sm font-medium text-gray-600">
						ISBN:
					</label>
					<input
						type="text"
						id="isbn"
						name="isbn"
						value={bookData.isbn}
						onChange={handleChange}
						className="mt-1 p-2 w-full border rounded-md"
						required
					/>
				</div>

				<div>
					<label htmlFor="language" className="block text-sm font-medium text-gray-600">
						Language:
					</label>
					<input
						type="text"
						id="language"
						name="language"
						value={bookData.language}
						onChange={handleChange}
						className="mt-1 p-2 w-full border rounded-md"
						required
					/>
				</div>

				<div>
					<label htmlFor="language" className="block text-sm font-medium text-gray-600">
						Total Pages:
					</label>
					<input
						type="text"
						id="totalPages"
						name="totalPages"
						value={bookData.totalPages}
						onChange={handleChange}
						className="mt-1 p-2 w-full border rounded-md"
						required
					/>
				</div>


				<button
					type="submit"
					className="btn-dark"
				>
					Create Book
				</button>
			</form>
		</div>)
	);
};

export default CreateBookForm;
