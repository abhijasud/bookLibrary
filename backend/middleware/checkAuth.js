import { verifyJWT } from "../auth/jwt_helper.js";


const checkAuth = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];


	if (token == null) {
		return res.status(401).json({ error: "No access token" });
	}
	
	const result = await verifyJWT(token);
	// console.log(result);
	if(result === "error"){
		return res.status(500).json({error: "Something went wrong please login again"})
	}
	// console.log(result);
	
	req.user = result;
	next();

}

export default checkAuth