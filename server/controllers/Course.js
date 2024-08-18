const Course = require ('../models/Course');
const Tag = require ('../models/Tags');
const User = require ('../models/Users');
const {uploadImageToCloudinary} = require ('../utils/imageUploader');

// create course
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
    } = req.body;
    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validtion
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status (400).json ({
        success: false,
        message: 'All fields are required',
      });
    }

    // check for instructor
    const userId = req.user.id;
    // inctructor details
    const instructorDetails = await User.findOne ({userId});
    console.log ('Instructor Details:', instructorDetails);

    if (instructorDetails) {
      return res.status (404).json ({
        success: false,
        message: 'Instructor Details not found',
      });
    }
    // cheeck given tag is valid or not
    const tagDetails = await Tag.findById (tag);
    if (!tagDetails) {
      return res.status (400).json ({
        success: false,
        message: 'Tag details not found',
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary (
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create new entry in db
    const newCourse = await Course.create ({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add this new course to user schema of instructor
    await User.findByIdAndUpdate (
      {_id: instructorDetails._id},
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {new: true}
    );

    // update tag schema

    // return res
    return res.status (200).json ({
      success: true,
      message: 'Course created successfully',
    });
  } catch (error) {
    return res.status (500).json ({
      success: false,
      message: 'something went wrong, please try again',
      error: error.message,
    });
  }
};

// get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourse = await Course.find (
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate ('instructor')
      .exec ();
    return res.status (200).json ({
      success: true,
      message: 'Data fetched for all courses successfully',
    });
  } catch (error) {
    return res.status (500).json ({
      success: false,
      message: 'something went wrong , please try again',
      error: error.message,
    });
  }
};
