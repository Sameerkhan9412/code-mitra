const Profile=require('../models/Profile')
const User=require('../models/Users')

// update profile
exports.updateProfile=async(req,res)=>{
    try {
        // get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body; 
        // get user id
        const userId=req.user.id;
        // validation
        if(!contactNumber||!gender||!id){
            return res.status(400).json({
                success:false,
                message:"All fields are required, please try again"
            })
        }
        // find profile
        const userDetails=await User.findOne(userId);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findByIdAndUpdate(profileId)

        // update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();    //here i used save bcz object bna hua h

        // return res
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating section",
            error:error.message
        })
    }
}

// delete account
exports.deleteAccount=async(req,res)=>{
    try {
        // get id
        const id=req.user.id;
        // validation
        const userDetails=await User.findById(id)
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"user doesnt exist",
            })
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        // delete user
        await User.findOneAndDelete({_id:id});
        return res.status(200).json({
            success:true,
            message:"User deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while deleting account",
            error:error.message
        })
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try {
        // get id
        const id=req.user.id;
        const userDetails=await User.findOne(id).populate("addtionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
        })  
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating section",
            error:error.message
        })
    }
}