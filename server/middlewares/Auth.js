const jwt=require('jsonwebtoken')
require('dotenv').config();
const User=require('../models/Users')


// auth
exports.auth=async(req,res,next)=>{
    try {
        // extract token
        const token=req.cookies.token||req.body.token||req.header('authorization').replace(`bearer`,"");
        // if token is missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }
        // verify the token
        try {
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode)
            req.user=decode;
        } catch (error) {
            // verfification issue
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });

        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong while validation the token"
        })
    }
}




// isStudent
exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.accountType!=='Student'){
            return res.status(401).json({
                success:false,
                message:"this is protected route for students only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be varified, please try again"
        })
    }
}



// isInstructor

exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!=='Instructor'){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Instructors only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be varified, please try again"
        })
    }
}



// isAdmin

exports.isAdmin=async(req,res,next)=>{
    try {
        if(req.user.accountType!=='Admin'){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Admin only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be varified, please try again"
        })
    }
}



