const RatingAndReview=require('../models/RatingAndReview')
const Course=require("../models/Course")

// create rating
exports.createRating=async(req,res)=>{
    try {
        
        // get user id
        const userId=req.user.id;
        // fetch data from req body
        const {rating,review,courseId}=req.body;
        // check user is enrolled in course or not
        const coursedetails=await Course.findOne(
            {_id:courseId,
                studentsEnrolled:{$elemMatch:{$eq:userId}},
            }
        )
        if(!coursedetails){
            return res.status(400).json({
                success:false,
                message:"student is not enrolled in this course"
            })
        }
        // check if user already reviewed course
        const alreadyReviewed=await RatingAndReview.findOne({user:userId,course:courseId})
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"You are already reviewed the course"
            })
        }
        // create rating and reviews
        const ratingReview=await RatingAndReview.create({
            rating:review,
            course:courseId,
            user:userId
        })
    
        // update course with thsi review
        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews:ratingReview._id
            }
        },{new:true})
    
        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
// get average rating
exports.getAverageRating=async(req,res)=>{
    try {
        // get course id
        const {courseId}=req.body;
        // calculate rating 
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                }
            }
            ,{
                $group:{
                    _id:null,        //jitni bhi entry mere pass aayi thi, sabko single group me wrap krdiya
                    averageRating:{$avg:"$rating"}
                }
            }
        ])
        // return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        // if no rating found
        return res.status(200).json({
            success:true,
            message:"Average rating is 0 , no rating given till now",
            averageRating:0,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })   
    }
}
// get all rating
exports.getAllRating=async(req,res)=>{
    try {
        const allReview=await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image" //method to return selective field
        })
        .populate({
            path:"course",
            select:"courseName"
        })
        .exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReview
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}