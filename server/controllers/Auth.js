const User=require('../models/Users')
const OTP=require('../models/Otp')
const otpGenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Profile = require('../models/Profile')
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
        // console.log(otpBody);
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp:otp
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
exports.signup=async (req,res) => {
        try {
            const {firstName,lastName,email,password,confirmPassword,accountType,otp}=req.body;
        if(!firstName||!email||!password||!confirmPassword||!accountType||!otp){
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

        // Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "OTP not found",
			});
		} else if (otp != response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

        // Hash Password
        const hashedPassword=await bcrypt.hash(password,10);

        // entry in db
        const profileDetails=await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null})
        const user=await User.create({
            firstName,lastName,email,password:hashedPassword,accountType,additionalDetails:profileDetails._id,image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })
        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            user:user
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
        const user=await User.findOne({email}).populate('additionalDetails');
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
            accountType:user.accountType
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
exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id)
        
        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword } = req.body
        const isPasswordMatch = await bcrypt.compare(
          oldPassword,
          userDetails.password
        )
  
      // Validate old password
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
      return res.status(200).json({
        success:true,
        message:"Password Updated Successfully",
      })
  
    }
catch (error) {
    res.status(500).json({
        success:false,
        message:'something went wrong try again',
        error:error.message
    })
}  
} 
    


