const Tag=require('../models/Tags')
// create tag
exports.createTag=async(req,res)=>{
    try {
        const {name,description}=req.body;
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        // entry in db
        const tagDetails=await Tag.create({
            name:name,description:description
        })
        console.log(tagDetails)
        return res.status(200).json({
            success:false,
            message:"Tag created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong , please try again",
            error:error.message
        })
    }
}


// get all tags 
exports.getAllTags=async(req,res)=>{
    try {
        // const allTags=await Tag.find({});        it will works
        const allTags=await Tag.find({},{name:true,description:true});        //it confirm that name,descripton must exist
        return res.status(200).json({
            success:true,
            message:"All tags return successfully"
        })

    } catch (error) {
       return res.status(500).json({
            success:false,
            message:"something went wrong , please try again",
            error:error.messages
        }) 
    }
}