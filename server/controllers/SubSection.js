const SubSection=require('../models/SubSection')
const Section=require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// create subsection
exports.createSubSection=async(req,res)=>{
    try {
        // fetch data from req body
        const {sectionId,title,timeDuration,description}=req.body;
        // extract file
        const video=req.files.videoFile;
        // validation
        console.log(req.body)
        if(!sectionId||!title||!timeDuration||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        // upload vidoe to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        // create a subsection
        const subsectionDetails=await SubSection.create({
            title:title,timeDuration:timeDuration,description:description,videoUrl:uploadDetails.secure_url
        })

        // update section with this subsection
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: subsectionDetails._id } },
            { new: true }
          ).populate("subSection")


        // return res
        return res.status(200).json({
            success:true,
            message:"subsection created successfully",
            data:updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating section",
            error:error.message
        })
    }
}

// update subsection
exports.updateSubSection=async(req,res)=>{
    try {
        const {subSectioName,subSectionId,}=req.body;
        if(!subSectioName||!subSectioName){
            return res.status(400).json({
                success:false,
                message:"All fields are required,please try again",
                error:error.message
            })
        }
        // update data
        await SubSection.findOneAndUpdate(subSectionId,{subSectioName},{new:true})
        // return res
        return res.status(200).json({
            success:true,
            message:"section updated successfully",
            
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while updating section",
            error:error.message
        })
    }
}

// delete section
exports.deleteSubSection=async(req,res)=>{
    try {
        // assume we are sending section id in params
        const {subSectionId}=req.params;
        // validtiaon
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required,please try again",
            })
        }
        await SubSection.findOneAndDelete(subSectionId);
        return res.status(200).json({
            success:true,
            message:"subsection deleted successfully",
            error:error.message
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating section",
            error:error.message
        })
    }
}