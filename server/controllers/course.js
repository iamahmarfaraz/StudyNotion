const Course = require("../models/course");
const Category = require("../models/category");
const User =  require("../models/user");
const Section = require("../models/section");
const SubSection = require("../models/subSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const CourseProgress = require("../models/courseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
require("dotenv").config();


// Create Course Handler
exports.createCourse = async (req,res) => {
    try {
        
        // Fetch Data from request File
        const {courseName,courseDescription,whatYouWillLearn,price,tag:_tag,category,status,
          instructions: _instructions,
          courseLanguage,courseLevel
        } = req.body;

        // get Thumbnail
        const thumbnail = req.files.thumbnailImage;

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);
        
        // Validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price 
            || !category || !thumbnail || !courseLanguage || !courseLevel) {
                return res.status(400).json({
                    success:false,
                    message:"All Fields are required "
                });
        }

        // Check whether Instructor to add instructor in course also add course in instructor schema
        const userId = req.user.id;
        // Check if the user is an instructor
        const instructorDetails = await User.findById(userId, {
          accountType: "Instructor",
        });

        if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

        // check given category is valid or not(just for POSTMAN)
        // const categoryDetails = await Category.find({name:category});
        const categoryDetails = await Category.findById(category); 
        if (!categoryDetails) {
            return res.status(400).json({
                success:false,
                message:"Category Details not Found"
            });
        }
        
        // Upload Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        // Create an Entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            tag: tag,
            price:price,
            category: categoryDetails._id,
            thumbnail : thumbnailImage.secure_url,
            status: status,
			      instructions: instructions,
            language : courseLanguage,
            level:courseLevel,
            ratingAndReviews:[],
        })

        // Add the new course in User Schema of Instructor
        await User.findOneAndUpdate({_id : instructorDetails._id},
            {$push:{courses: newCourse._id }},{new:true}); 

        // Update the category schema - HW
         await Category.findOneAndUpdate({_id:categoryDetails._id},
            {$push:{courses:newCourse._id}},{new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    } catch (error) {
        console.error("Error While Creating Course",error);
        return res.status(400).json({
            success:false,
            message: "Course Creation Failed",
            error: error.message,
        });
    }
}

exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body;
      const updates = req.body;
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update");
        const thumbnail = req.files.thumbnailImage;
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        );
        course.thumbnail = thumbnailImage.secure_url;
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key]);
          } else {
            course[key] = updates[key];
          }
        }
      }
  
      await course.save();
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

// Get all courses
exports.getAllCourses = async (req,res) => {
    try {
       
        const allCourses = await Course.find({},{courseName:true,
                                            price:true,
                                            thumbnail:true,
                                            instructor:true,
                                            ratingAndReviews:true,
                                            studentsEnrolled:true,})
                                            .populate("instructor")
                                            .exec();

        return res.status(200).json({
            success:true,
            message:"Fetched all courses",
            data:allCourses,
        });
        
    } catch (error) {
        console.log("Error while Fetching All Course",error);
        return res.status(500).json({
            success:false,
            message:"Can't Fetch Course Data ",
            error: error.message,
        });
    }
}

// get course details with course id - HW
exports.getCourseDetails =  async (req,res) => {
    try {
        
        // fetch courseId from request body
        const {courseId }= req.body;

        // Validation
        if(!courseId){
            return res.status(401).json({
                success:false,
                message:"CourseId not provided"
            })
        }

        // fetch course with populated objects
        const courseDetails = await Course.findOne({_id: courseId})
        .populate({
          path: 'courseContent',
          populate: {
            path: 'subSection'
          }
        })
        .populate({
          path: 'instructor',
          populate: [
            { path: 'courses' }, // Populating instructor's courses
            { path: 'additionalDetails' } // Populating instructor's additionalDetails
          ]
        })
        .populate("ratingAndReviews")
        .populate("category")
        .populate({
          path: 'studentsEnrolled',
          populate: {
            path: 'additionalDetails'
          }
        })
        .exec();


        if (!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`No Course Found with courseId :- ${courseId}`
            })
        }

        // Iterate over studentsEnrolled array to remove sensitive information-Extra Feature
        courseDetails.studentsEnrolled.forEach(student => {
            student.password = undefined;
            student.token = undefined;
            if (student.additionalDetails) {
                student.additionalDetails.contactNumber = undefined;
            }
        });

        let totalDuration = 0;
        courseDetails.courseContent.forEach((section) => {
            section.subSection.forEach((lecture) => {
                // Ensure lecture.length exists and is a number before adding it to totalDuration
                if (lecture && lecture.timeDuration && !isNaN(parseFloat(lecture.timeDuration))) {
                  totalDuration += parseFloat(lecture.timeDuration); // Convert to number
                }
            });
        });

        courseDetails.instructor.password = undefined;
        courseDetails.instructor.token = undefined;
    
        // Check if additionalDetails exists before accessing its properties
        if (courseDetails.instructor.additionalDetails) {
            courseDetails.instructor.additionalDetails.contactNumber = undefined;
        }

        totalDuration = convertSecondsToDuration(totalDuration);

        const courseResponse = {
            ...courseDetails._doc, // Extract the document properties
            totalDuration, // Add totalDuration to the response object
        };


        // return response
        return res.status(200).json({
            success:true,
            message:"Course Details Found",
            data : courseResponse,
        })

    } catch (error) {
        console.log("Error while getting all details of Course",error)
        return res.status(500).json({
            success:false,
            message:"No Course Found "
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.user.id;
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
  
      //TODO Doubt in this
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      });
  
      console.log("courseProgressCount : ", courseProgressCount);
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        });
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0;
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration);
          totalDurationInSeconds += timeDurationInSeconds;
        });
      });
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  
//getInstructorAllCourses
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Fetch courses based on the instructor
    const courses = await Course.find({ instructor: instructorId })
      .populate({
        path: 'courseContent', 
        populate: {
          path: 'subSection',
        }
      }).exec();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ error: "No courses found." });
    }

    // Function to convert duration in 'Xh Ym Zs' format to seconds
    const convertDurationToSeconds = (durationStr) => {
      let totalSeconds = 0;
      const durationParts = durationStr.split(' ');

      durationParts.forEach((part) => {
        const unit = part.slice(-1);  // 'h', 'm', or 's'
        const value = parseInt(part.slice(0, -1), 10); // Numeric part

        if (unit === 'h') {
          totalSeconds += value * 3600;  // Convert hours to seconds
        } else if (unit === 'm') {
          totalSeconds += value * 60;    // Convert minutes to seconds
        } else if (unit === 's') {
          totalSeconds += value;         // Seconds
        }
      });

      return totalSeconds;
    };

    // Loop through each course to calculate total duration in hours, minutes, and seconds
    const instructorCourses = courses.map((course) => {
      let totalDurationInSeconds = 0;

      // Loop through each section
      course.courseContent.forEach((section) => {
        // Loop through each subsection to get the timeDuration
        section.subSection.forEach((subSection) => {
          // Convert the timeDuration string (e.g., '2h 30m' or '45m 30s') to seconds
          const durationInSeconds = convertDurationToSeconds(subSection.timeDuration);
          totalDurationInSeconds += durationInSeconds;
        });
      });

      // Convert total duration from seconds to hours, minutes, and seconds
      const hours = Math.floor(totalDurationInSeconds / 3600);
      const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
      const seconds = totalDurationInSeconds % 60;

      // Format total duration as "Xh Ym Zs"
      const formattedDuration = `${hours}h ${minutes}m ${seconds}s`;

      // Add totalDuration (in "Xh Ym Zs" format) to course details
      return {
        ...course.toObject(),
        totalDuration: formattedDuration,
      };
    });

    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error("Could not get Instructor Courses", error);
    res.status(500).json({ error: "Could not get Instructor Courses" });
  }
};

// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body;
  
      // Find the course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled;
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        });
      }
  
      // Find the category
      const category = await Category.findByIdAndUpdate(course.category,{
        $pull: {courses: courseId}
      });
  
      console.log(category)
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent;
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId);
        if (section) {
          const subSections = section.subSection;
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId);
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId);
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId);
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };