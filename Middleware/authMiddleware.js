const jwt = require("jsonwebtoken")
const User = require('../models/userModel');

// This will ensure only user that logged in successfully can access some specific route as specified
const protect = async(req, res, next) => {
    try{    
        const token = req.cookies.access_token
        // console.log(token)
        if(!token){
            res.status(201);
            throw new Error("You are not authorized, please login!")
        }

        // To verify the token
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        // To get the user id from the token
        const user = await User.findById(verifiedToken.id).select("-password")
        // To check if user exist
        if(!user) {
            res.status(401);
            throw new Error("User not found!")
        }

        req.user = user;
        next();
    } catch{
        res.status(401);
        throw new Error("You are not authorized, please login!")
    }
}


module.exports = { protect };