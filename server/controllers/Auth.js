const User=require('../models/Users')
const OTP=require('../models/Otp')
const otpGenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config();
// send otp
exports.sendOtp=async(req,res)=>{
    try {
        const {email}=req.body;
        // check user is already exist or not
        const checkUserPresentOrNot=await User.findOne({email});
        if(checkUserPresentOrNot){
            return res.status(401).json({
                success:false,
                message:"User is already ragistered"
            })
        }
        // generate otp
        let otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        console.log("OTP generated successfully",otp);

        // check otp is unique or not
        const result=await OTP.findOne({otp:otp});
        while(result){
            otp=otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            result=await otp.findOne({otp:otp});
        }
        // create an entry in db
        const otpBody=await OTP.create({email:email,otp:otp});
        console.log(otpBody);
        res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })

        
    } catch (error) {
        console.log("error while sending otp",error);
        return res.status(500).json({
            success:false,
            message:"error while sending otp",
            error:error.message
        })
    }
}


// signup
exports.signup=async (req,result) => {
        try {
            const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;
        if(!firstName||!email||!password||!confirmPassword||!accountType||!contactNumber||!otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Paaword and confirm Password doesnt match"
            });
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered"
            });
        }

        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);// to fetch recent otp
        console.log(recentOtp);
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"Otp not found"
            })
        }
        else if(otp!==recentOtp.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid Otp"
            })
        }

        // Hash Password
        const hashedPassword=await bcrypt.hash(password,10);

        // entry in db
        const profileDetails=await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null})
        const user=await User.create({
            firstName,lastName,email,contactNumber,password:hashedPassword,accountType,additionalDetails:profileDetails._id,image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })
        return res.status(200).json({
            success:true,
            message:"User registered successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User cannot registered . Please try again",
            error:error.message
        })
    }
    
}


// login
exports.login=async(req,res)=>{
    try {
        // get data from the user
        const {email,password}=req.body;
        // validation data
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:`All fields are required , please try again`
            })
        }
        // check user is alreadt exist or not
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first"
            })
        }

        // generate JWT ,after passsword match
        const payload={
            email:email,
            id:user._id,
            role:user.accountType
        }
        if(await bcrypt.compare(password,user.password)){
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h'
            })
            user.token=token;
            user.password=undefined;

            // create cookie and send response
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully"
            })
        }
        else{
            res.status(401).json({
                success:false,
                message:'Password is incorrect'
            })
        }

    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Login failure , please try again',
            error:error.message
        })
    }   
}

//change Password:
exports.changePassword=async(req,res)=>{
    // get data from request body
    const {oldPassword,newPassword,confirmNewPassword}=req.body;
    // validation
    if(!oldPassword||!newPassword||!confirmNewPassword){
        return res.status(403).json({
            success:false,
            message:`All fields are required , please try again`
        })
    }
    // update password db
    
    // send email->password updated
    // return response

}


