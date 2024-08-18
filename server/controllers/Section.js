const Section=require('../models/Section')
const Course =require('../models/Course')
exports.createSection=async(req,res)=>{
    try {
        // data fetch
        const {sectionName,courseId}=req.body;
        // data validation
        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"course not found",
                error:error.message
            })
        }
        // create section
        const newSection=await Section.create({sectionName})
        // update course with section object id
        const updatedCourseDetails=await Course.findByIdAndUpdate({courseId},{$push:{courseContent:newSection._id}},{new:true})
        // return res
        return res.status(200).json({
            success:true,
            message:"Seciton created successfully",
            updatedCourseDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating section",
            error:error.message
        })
    }
}

// update section
exports.updateSection=async(req,res)=>{
    try {
        // fetch data
        const {sectionName,sectionId}=req.body;
        // data validatio
        if(!sectionName||!sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required,please try again",
                error:error.message
            })
        }
        // update data
        const section=await Section.findOneAndUpdate(sectionId,{sectionName},{new:true})
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
exports.deleteSection=async(req,res)=>{
    try {
        // assume we are sending section id in params
        const {sectionId}=req.params;
        // validtiaon
        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required,please try again",
            })
        }
        await Section.findOneAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
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