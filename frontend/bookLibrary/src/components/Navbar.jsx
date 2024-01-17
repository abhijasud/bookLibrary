import React, { useContext } from 'react'
import { Outlet } from 'react-router'
import { UserContext } from '../App'
import { Link } from 'react-router-dom';
import { logOutUser } from '../common/session';

const Navbar = () => {

	const { userAuth, userAuth: { access_token }, setUserAuth } = useContext(UserContext);

	const handleLogout = () => {
		setUserAuth({ access_token: null })
		logOutUser();
	}

	return (
		<>
			<div className='navbar'>

				{
					access_token ?
						<>
							<h1>Welcome {userAuth.username}</h1>
							<button onClick={handleLogout} className='btn-dark py-2 ml-auto'>Logout</button>

						</>
						:
						<>
							<Link className='btn-dark py-2' to="/signin">Sign In</Link>
							<Link className='btn-light py-2 hidden md:block' to="/signup">Sign Up</Link>
						</>
				}

			</div>
			<Outlet />
		</>
	)
}

export default Navbar