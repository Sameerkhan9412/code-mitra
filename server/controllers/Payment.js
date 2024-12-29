const {instance}=require('../config/razorpay')
const Course=require('../models/Course')
const User=require('../models/Users')
const mailSender=require('../utils/mailSender')
const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollmentMail')
const { default: mongoose } = require('mongoose')
const crypto =require('crypto')
const CourseProgress = require('../models/CourseProgress')
exports.capturePayment=async(req,res)=>{
    // get course id and userid
    const {courses}=req.body;
    const userId=req.user.id;
    // validation
    // valid course id 
    if(!courses[0]){
        return res.status(400).json({
            success:false,
            message:"Please provide valid course id" 
        })
    }
    // valid coursedetails
    const course_id=courses
    let course;
    try {
        course=await Course.findById(course_id)
        if(!course){
            return res.status(400).json({
                success:false,
                message:"could find the course"
            })
        }
        // user already pay for the same course
        const uid=new mongoose.Schema.Types.ObjectId(course_id) //courseid is in string datatype so , we should change to objectid
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success:false,
                message:"Student is already enrolled"
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    // order create
    const amount=course.price;
    const currency="INR"

    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseID:course_id,
            userId,
        }
    }
    try {
        // initialize the payment using razorpay
        const paymentResponse=await instance.orders.create(options);
        return res.status(200).json({
            success:true,
            message:paymentResponse
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Could not initiate order"
        })
    }
}


exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body ?. razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body ?. razorpay_signature;
    const courses = req.body.courses;
    const userId = req.user.id;
    if (! razorpay_order_id || ! razorpay_payment_id || ! razorpay_signature || ! courses || ! userId) {
        return res.status(200).json({success: false, message: "Payment Failed"})
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;       //acccording to razorpay docs
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
    if (expectedSignature === razorpay_signature) { // enroll karao students ko
        await enrolledStudents(courses, userId, res)
        return res.status(200).json({success: true, message: "Payment Verfied"})
    }
    return res.status(200).json({success: false, message: "Payment failed"});
}


// enroll student
const enrolledStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({success: false, message: "Please Provide data for Courses or useerId"})
    }
    try{
        for (const courseID of courses) {
            const enrolledCourse = await Course.findOneAndUpdate({
                _id: courseID
            }, {
                $push: {
                    studentsEnrolled: userId
                }
            }, {
                new: true
            },)
            if (! enrolledCourse) {
                return res.status(500).json({success: false, message: "Course not Found"});
            }

            const courseProgress = await CourseProgress.create({
                courseID: courseID,
                userId: userId,
                completedVideos: [],
                })
                
            // find the student and add the course to their list of enrolledcourses
            const enrolledStudent = await User.findByIdAndUpdate(userId, {
                $push: {
                    courses: courseID,
                    courseProgress:courseProgress._id,
                }
            }, {new: true});
            // enrolled student ko mail send kardo
            const emailResponse=await mailSender(
                enrolledStudent.email,
                `successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`+ " "+`${enrolledStudent.lastName}` )
                )
                console.log("Email Sent successfully",emailResponse);
            }
        }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.sendPaymentSuccessEmail=async(req,res)=>{
    const {orderId,paymentId,amount}=req.body;
    const userId=req.user.id;
    if(!orderId||!paymentId||!amount||!userId){
        return res.status(400).json({
            success:false,
            message:"Please provide all the fields"
        })
    }
    try {
        // students ko enroled karao yaar
        const enrolledStudent=await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            "Payment Received",
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
            amount/100,
            orderId,
            paymentId
            )
        )
    } catch (error) {
        console.log("error in sending mail",error)
        return res.status(500).json( {
            success:false,
            message:"Could not send email"
        }   )
    }
}