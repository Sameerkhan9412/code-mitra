const Profile=require('../models/Profile')
const User=require('../models/Users');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// update profile
exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", contactNumber } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);

		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;

		// Save the updated profile
		await profile.save();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

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

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};