const express=require('express')
const app=express()

/************************************************ 
                 IMPORT  ROUTES
*************************************************/
const userRoutes=require('./routes/User.js')
const profileRoutes=require('./routes/Profile')
const courseRoutes=require('./routes/course')
const paymentRoutes=require('./routes/Payment')

const database=require('./config/database')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const {cloudinaryConnect}=require('./config/cloudinary')
const fileUpload=require('express-fileupload')
const dotenv=require('dotenv')

dotenv.config()
const PORT=process.env.PORT;

database.connect()
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin:"http://localhost:3000", //MEANS MUJHE IS FRONTEND URL KO ENTERTAIN KRNA HAI
        credentials:true        // or bhi flags hai
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp"
    })
)

// cloudinary connect
cloudinaryConnect()

//routes
app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)

// default route
app.get("/",(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"server is running .......... 🟢 🏃‍♀️‍➡️🏃‍➡️"
    })
})

app.listen(PORT,()=>{
    console.log(`server is running at port no ${PORT}`)
})
