import JWT from "jsonwebtoken";

export const signJWT = (payload) => {
	const expiresIn = '12h'
	const accessToken = JWT.sign(payload, process.env.JWT_SECRET, {expiresIn});

	return accessToken;
}

export const verifyJWT = async (token) => {
	try {
	  const decoded = await new Promise((resolve, reject) => {
		JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		  if (err) {
			reject(err);
		  } else {
			resolve(decoded);
		  }
		});
	  });
  
	//   console.log(decoded);
	  return decoded;
	} catch (error) {
	  if (error.name === 'TokenExpiredError') {
		return 'error';
	  } else {
		return 'error';
	  }
	}
  };

