import { Link, Navigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios';
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import InputBox from "./InputBox";
import AnimationWrapper from "../common/pageAnimation";
import Dropdown from "./Dropdown";





const UserAuthForm = ({ type }) => {

	// const formElement = useRef(null);
	const [selectedRole, setSelectedRole] = useState("");

	const roleOptions = [
		{ value: "viewer", label: "Viewer" },
		{ value: "creator", label: "Creator" },
	  ];

	let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
	console.log(access_token);

	const userAuthThroughtServer = (serverRoute, formData) => {
		axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
			.then(({ data }) => {
				storeInSession("user", JSON.stringify(data));
				setUserAuth(data);
				console.log(sessionStorage);
			})
			.catch(({ response }) => toast.error(response?.data?.error));
	}


	const handleSubmit = (e) => {
		e.preventDefault();


		let serverRoute = type == "sign-in" ? "/signin" : "/signup";

		let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
		let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
		// form data
		let form = new FormData(formElement)
		let formData = {};
		for (let [key, value] of form.entries()) {
			formData[key] = value;
		}

		// form validation
		let { fullname, email, password, role } = formData;
		console.log(role);

		if (type !== "sign-in") {
			if (!role) {
			  return toast.error("Select a role");
			}
		  }

		// console.log(fullname);

		if (fullname) {
			if (fullname.length < 3) {
				return toast.error("Fullname must be atleast 3 letters long");
			}
		}

		if (email == undefined || !email.length) {
			return toast.error("Enter email");
		}

		if (!emailRegex.test(email)) {
			return toast.error("Email is invalid")
		}

		if (password == undefined || !passwordRegex.test(password)) {
			return toast.error("Password should be 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letters");
		}

		userAuthThroughtServer(serverRoute, formData);

	}

	return (
		access_token ?
			<Navigate to="/" />
			:
			<AnimationWrapper key={type}>
				<section className="h-cover flex items-center justify-center">
					<Toaster />
					<form id="formElement" className="w-[80%] max-w-[400px]">
						<h1 className="text-4xl font-gelasio capitalize text-center mb-24">
							{type == "sign-in" ? "Welcome back" : "Join us today"}
						</h1>

						{
							type != "sign-in" ?
								<InputBox name="fullname" type="text" placeholder="Full Name" icon="fi-rr-user" />
								: ""
						}
						<InputBox name="email" type="email" placeholder="Email" icon="fi-rr-envelope" />

						<InputBox name="password" type="password" placeholder="Password" icon="fi-rr-key" />

						{type !== "sign-in" && (
							<Dropdown
								name="role"
								options={roleOptions}
								value={selectedRole}
								onChange={(e) => setSelectedRole(e.target.value)}
								placeholder="Select Role"
								additionalClasses="my-custom-class"
							/>
						)}

						<button onClick={handleSubmit} type="submit" className="btn-dark center mt-14">{type.replace("-", " ")}</button>

						<div className="relative w-full flex items-center gap-2 my-10 uppercase text-black font-bold opacity-10">
							<hr className="w-1/2 border-black" />
							<p>or</p>
							<hr className="w-1/2 border-black" />
						</div>


						{
							type == "sign-in" ?
								<p className="mt-6 text-dark-grey text-xl text-center"> Don't  have an account ?
									<Link to="/signup" className="underline text-black text-xl ml-1">Join Us</Link></p>
								: <p className="mt-6 text-dark-grey text-xl text-center"> Already a member ? <Link to="/signin" className="underline text-black text-xl ml-1">Sign in here</Link></p>
						}

					</form>
				</section>
			</AnimationWrapper>
	)
}

export default UserAuthForm;