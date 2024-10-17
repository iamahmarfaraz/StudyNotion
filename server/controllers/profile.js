const Profile = require("../models/profile");
const User = require("../models/user");
const Course = require("../models/course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/courseProgress");

exports.updateProfile = async (req, res) => {
  try {
    // Fetch data and userID
    const {
      firstName,
      lastName,
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender,
    } = req.body;
    const id = req.user.id;

    // validation
    if (!id || !contactNumber) {
      return res.status(401).json({
        success: false,
        message: "Fill the Mandatory Field",
      });
    }

    // FETCH Profile
    const userDetails = await User.findById(id);
    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    await userDetails.save();
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();
    const updatedUserDetails = await User.populate(
      userDetails,
      "additionalDetails"
    );

    // return response
    // profileDetails.contactNumber = undefined;
    return res.status(200).json({
      success: true,
      message: "Profile Updation Sucessfull",
      updatedUserDetails,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Profile updation failed",
    });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    // get id
    console.log("Printing ID :- ", req.user);
    const id = req.user.id;

    // check if valid id or not
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User Doesn't exists",
      });
    }

    // delete profile corresponding to the user
    await Profile.findByIdAndDelete({ _id: existingUser.additionalDetails });

    // remove user from studentsEnrolled array object of each course  Course model
    existingUser.courses.map(async (course) => {
      await Course.findByIdAndUpdate(
        { _id: course },
        { $pull: { studentsEnrolled: id } }
      );
    });

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile Deletion Successfull",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Profile Deletion failed",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // get userdetails and validate
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "User details Fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Fetching all the details of user failed",
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        
        // Total Videos(SubSection) in Section
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      //Total Duration of all the videos(subsection) in Section
      userDetails.courses[i].totalDuration = convertSecondsToDuration(
        totalDurationInSeconds
      );

      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      // No of Video(subsection) u have watched
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.log("Error in Token :- ",error);
    return res.status(500).json({
      success: false,
      
      message: error.message,
    });
  }
};

//Instructor Dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    //get instructor id
    const userId = req.user.id;

    //geting intructor all courses
    const courseDeatils = await Course.find({ instructor: userId });

    //getting info from course
    const courseData = courseDeatils.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;
      //create an new object with the additional details
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        totalStudentsEnrolled: totalStudentsEnrolled,
        totalAmountGenerated: totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "Instructor Dashboard data send sucessfully",
      courses: courseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
