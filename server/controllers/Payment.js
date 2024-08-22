const {instance}=require('../config/razorpay')
const Course=require('../models/Course')
const User=require('../models/Users')
const mailSender=require('../utils/mailSender')
const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollmentMail')
const { default: mongoose } = require('mongoose')

// capture the payment and initiaze the razorpay order
exports.capturePayment=async(req,res)=>{
    // get course id and userid
    const {course_id}=req.body;
    const userId=req.user.id;
    // validation
    // valid course id 
    if(!course_id){
        return res.status(400).json({
            success:false,
            message:"Please provide valid course id"
        })
    }
    // valid coursedetails
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
        console.log(paymentResponse)
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Could not initiate order"
        })
    }
}

// verify signature of Razorpay and server
exports.verifySignature=async(req,res)=>{
    const webhookSecret="12345";
    const signature=req.headers['x-razorpay-signature'];
    const shasum=crypto.createHmac("sha256",webhookSecret)
    shasum.update(JSON.stringify(req.body))
    const digest=shasum.digest("hex")

    if(signature==digest){
        console.log("Payment is authorized")
        const {courseId,userId}=req.body.payload.payment.entity.notes;
        try {
            // find the course and enroll the student on it
            const enrolledCourse=await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true}
            )
            if(!enrolledCourse){
                return res.status(400).json({
                    success:true,
                    message:"Course not found"
                })
            }
            console.log(enrolledCourse)
            // find the student and add the course to their list enrolled courses me
            const enrolledStudent=await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true}
            )
            console.log(studentsEnrolled)


            // Mail send for confirmation
            const emailResponse=await mailSender(
                enrolledStudent.email,
                "from sameer khan",
                "Congretulation , you are enrolled"
            );
            console.log(emailResponse)
            return res.status(200).json({
                success:true,
                message:"Course added successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message
            })   
        }
    }
    else{
        return res.status(500).json({
            success:false,
            message:'Invalid request'
        })
    }
}
